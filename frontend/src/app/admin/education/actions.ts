'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Modules
export async function getModules() {
  return await prisma.educationModule.findMany({
    orderBy: { id: 'asc' }
  });
}

export async function createModule(data: any) {
  const mod = await prisma.educationModule.create({
    data: {
      title: data.title,
      category: data.category,
      points: data.points,
      duration: data.duration,
      desc: data.desc,
      status: data.status || 'draft'
    }
  });
  revalidatePath('/admin/education');
  return mod;
}

export async function updateModule(id: number, data: any) {
  const mod = await prisma.educationModule.update({
    where: { id },
    data
  });
  revalidatePath('/admin/education');
  revalidatePath(`/dashboard/education`);
  return mod;
}

export async function deleteModule(id: number) {
  await prisma.educationModule.delete({
    where: { id }
  });
  revalidatePath('/admin/education');
}

// Pages
export async function getModulePages(moduleId: number) {
  return await prisma.educationPage.findMany({
    where: { moduleId },
    orderBy: { pageOrder: 'asc' }
  });
}

export async function saveModulePages(moduleId: number, pages: any[]) {
  // Delete existing and recreate
  await prisma.educationPage.deleteMany({
    where: { moduleId }
  });
  
  if (pages.length > 0) {
    await prisma.educationPage.createMany({
      data: pages.map((p, index) => ({
        moduleId,
        subtitle: p.subtitle,
        text: p.text,
        pageOrder: index
      }))
    });
  }
}

// Quizzes
export async function getQuizzes() {
  return await prisma.educationQuiz.findMany({
    include: { module: true },
    orderBy: { id: 'asc' }
  });
}

export async function getQuizByModule(moduleId: number) {
  return await prisma.educationQuiz.findMany({
    where: { moduleId },
    orderBy: { id: 'asc' }
  });
}

export async function saveModuleQuizzes(moduleId: number, quizzes: any[]) {
  // Delete existing and recreate for the module
  await prisma.educationQuiz.deleteMany({
    where: { moduleId }
  });
  
  if (quizzes.length > 0) {
    await prisma.educationQuiz.createMany({
      data: quizzes.map(q => ({
        moduleId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points || 150,
        status: q.status || "active",
        explanation: q.explanation || ""
      }))
    });
  }
}

export async function createQuiz(data: any) {
  const quiz = await prisma.educationQuiz.create({
    data: {
      moduleId: data.moduleId,
      question: data.question,
      options: data.options,
      correctAnswer: data.correctAnswer,
      points: data.points,
      status: data.status,
      explanation: data.explanation || ""
    }
  });
  revalidatePath('/admin/education');
  return quiz;
}

export async function updateQuiz(id: number, data: any) {
  const quiz = await prisma.educationQuiz.update({
    where: { id },
    data
  });
  revalidatePath('/admin/education');
  return quiz;
}

export async function deleteQuiz(id: number) {
  await prisma.educationQuiz.delete({
    where: { id }
  });
  revalidatePath('/admin/education');
}
