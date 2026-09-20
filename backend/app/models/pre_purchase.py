# type: ignore
# pyright: reportMissingImports=false, reportGeneralTypeIssues=false, reportCallIssue=false
"""
SQLAlchemy ORM Models — CEAMIS 2.0 Pre-Purchase & Model Governance
Berdasarkan spesifikasi docs/ceamis 2.0/DATABASE_SCHEMA.md
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, List, Any

try:
    from sqlalchemy import (
        Column,
        String,
        Boolean,
        Integer,
        Numeric,
        DateTime,
        Text,
        ForeignKey,
        JSON,
    )
    from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
    from sqlalchemy.orm import declarative_base, relationship

    Base = declarative_base()
except ImportError:
    # Fallback saat runtime jika sqlalchemy belum terpasang di local environment
    class _FallbackBase:
        pass

    class _FallbackType:
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            pass

        def __call__(self, *args: Any, **kwargs: Any) -> Any:
            return self

    Base = _FallbackBase
    Column = relationship = lambda *args, **kwargs: None
    String = Boolean = Integer = Numeric = DateTime = Text = ForeignKey = JSON = PG_UUID = JSONB = _FallbackType


class ModelVersion(Base):
    """Registry Model ML untuk audit & governance versioning."""
    __tablename__ = "model_versions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    version_tag = Column(String(50), nullable=False, unique=True, index=True)
    algorithm = Column(String(50), nullable=False)
    precision_score = Column(Numeric(5, 4), nullable=True)
    recall_score = Column(Numeric(5, 4), nullable=True)
    f1_score = Column(Numeric(5, 4), nullable=True)
    roc_auc_score = Column(Numeric(5, 4), nullable=True)
    artifact_path = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False, nullable=False, index=True)
    deployed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    deployed_by = Column(PG_UUID(as_uuid=True), nullable=True)

    predictions = relationship("RiskPrediction", back_populates="model_version")


class PrePurchaseCheck(Base):
    """Log Permintaan Evaluasi Risiko Pra-Pembelian."""
    __tablename__ = "pre_purchase_checks"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)
    category_id = Column(PG_UUID(as_uuid=True), nullable=False)
    planned_amount = Column(Numeric(15, 2), nullable=False)
    merchant_name = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    user_decision = Column(
        String(20),
        default="PENDING",
        nullable=False,
    )  # PENDING, PROCEED, ADJUST, POSTPONE
    decided_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # 1-to-1 relationships
    prediction = relationship(
        "RiskPrediction",
        uselist=False,
        back_populates="check",
        cascade="all, delete-orphan",
    )
    feedback = relationship(
        "PostDecisionFeedback",
        uselist=False,
        back_populates="check",
        cascade="all, delete-orphan",
    )


class RiskPrediction(Base):
    """Hasil Inferensi Model Risiko & Snapshot Fitur Kontekstual."""
    __tablename__ = "risk_predictions"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    check_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("pre_purchase_checks.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    model_version_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("model_versions.id"),
        nullable=True,
    )
    risk_score = Column(Numeric(5, 4), nullable=False)
    risk_level = Column(String(10), nullable=False)  # LOW, MEDIUM, HIGH
    features_snapshot = Column(JSON, nullable=False)  # 7 contextual features
    trigger_factors = Column(JSON, nullable=False)    # Alasan risiko
    budget_remaining_before = Column(Numeric(15, 2), nullable=False)
    budget_remaining_after = Column(Numeric(15, 2), nullable=False)
    savings_delayed_days = Column(Integer, default=0, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    check = relationship("PrePurchaseCheck", back_populates="prediction")
    model_version = relationship("ModelVersion", back_populates="predictions")


class PostDecisionFeedback(Base):
    """Feedback Pasca-Keputusan untuk Ground Truth & Retraining Model."""
    __tablename__ = "post_decision_feedbacks"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    check_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("pre_purchase_checks.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    was_impulsive = Column(Boolean, nullable=False)
    satisfaction_rating = Column(Integer, nullable=True)  # 1 to 5
    feedback_notes = Column(Text, nullable=True)
    submitted_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    check = relationship("PrePurchaseCheck", back_populates="feedback")


class AuditLog(Base):
    """Audit Log Operator/Admin untuk Intervensi & Governance Model."""
    __tablename__ = "audit_logs"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)
    action = Column(String(50), nullable=False)  # e.g. DEPLOY_MODEL, ROLLBACK_MODEL
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
