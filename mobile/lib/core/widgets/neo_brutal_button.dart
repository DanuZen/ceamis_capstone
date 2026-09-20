// lib/core/widgets/neo_brutal_button.dart

import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// Neo-Brutalist Tactile Button with click offset micro-interaction.
class NeoBrutalButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final Widget child;
  final Color backgroundColor;
  final Color textColor;
  final Color borderColor;
  final Color? shadowColor;
  final double height;
  final double borderRadius;
  final double borderWidth;
  final bool isFullWidth;
  final bool isLoading;

  const NeoBrutalButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.backgroundColor = AppColors.purple,
    this.textColor = AppColors.white,
    this.borderColor = AppColors.border,
    this.shadowColor,
    this.height = 52.0,
    this.borderRadius = 10.0,
    this.borderWidth = AppColors.borderWidth,
    this.isFullWidth = true,
    this.isLoading = false,
  });

  @override
  State<NeoBrutalButton> createState() => _NeoBrutalButtonState();
}

class _NeoBrutalButtonState extends State<NeoBrutalButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final effectiveShadowColor = widget.shadowColor ?? AppColors.shadow;

    Widget buttonContent = AnimatedContainer(
      duration: const Duration(milliseconds: 70),
      height: widget.height,
      width: widget.isFullWidth ? double.infinity : null,
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      transform: Matrix4.translationValues(
        _isPressed ? 2.0 : 0.0,
        _isPressed ? 2.0 : 0.0,
        0.0,
      ),
      decoration: BoxDecoration(
        color: widget.backgroundColor,
        borderRadius: BorderRadius.circular(widget.borderRadius),
        border: Border.all(color: widget.borderColor, width: widget.borderWidth),
        boxShadow: [
          BoxShadow(
            color: effectiveShadowColor,
            offset: Offset(_isPressed ? 2.0 : 4.0, _isPressed ? 2.0 : 4.0),
            blurRadius: 0, // Hard shadow
          ),
        ],
      ),
      alignment: Alignment.center,
      child: widget.isLoading
          ? SizedBox(
              height: 24,
              width: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation<Color>(widget.textColor),
              ),
            )
          : DefaultTextStyle(
              style: TextStyle(
                color: widget.textColor,
                fontWeight: FontWeight.w700,
                fontSize: 16.0,
              ),
              child: widget.child,
            ),
    );

    return GestureDetector(
      onTapDown: widget.onPressed == null || widget.isLoading
          ? null
          : (_) => setState(() => _isPressed = true),
      onTapUp: widget.onPressed == null || widget.isLoading
          ? null
          : (_) {
              setState(() => _isPressed = false);
              widget.onPressed!();
            },
      onTapCancel: () => setState(() => _isPressed = false),
      child: buttonContent,
    );
  }
}
