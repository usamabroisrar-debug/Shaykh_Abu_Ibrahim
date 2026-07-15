import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";

type IssueCertificateInput = {
  studentEmail: string;
  courseId: string;
  issuedById: string;
  issuedAt?: Date;
};

function cleanValue(value: string) {
  return value.trim();
}

function buildCoursePrefix(title: string) {
  const normalized = title
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.slice(0, 3).toUpperCase())
    .join("");

  return normalized || "CERT";
}

async function generateUniqueCertificateNumber(courseTitle: string) {
  const year = new Date().getFullYear();
  const prefix = buildCoursePrefix(courseTitle);

  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const serial = String(Date.now()).slice(-6);
    const candidate = `${prefix}-${year}-${serial}-${attempt}`;
    const existing = await prisma.certificate.findUnique({
      where: { certificateNo: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Unable to generate unique certificate number.");
}

async function generateUniqueVerificationId(courseTitle: string) {
  const year = new Date().getFullYear();
  const prefix = buildCoursePrefix(courseTitle);

  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const serial = `${Date.now()}${attempt}`.slice(-8);
    const candidate = `${prefix}-${year}-${serial}`;
    const existing = await prisma.certificate.findUnique({
      where: { verificationId: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Unable to generate unique verification id.");
}

export async function issueCertificate(input: IssueCertificateInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured.");
  }

  const studentEmail = cleanValue(input.studentEmail).toLowerCase();
  const courseId = cleanValue(input.courseId);

  if (!studentEmail || !courseId) {
    throw new Error("Student email and course are required.");
  }

  const [student, course, issuer] = await Promise.all([
    prisma.user.findUnique({
      where: { email: studentEmail },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: {
          select: { name: true },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: input.issuedById },
      select: { id: true, name: true },
    }),
  ]);

  if (!student || !["STUDENT", "PARENT"].includes(student.role)) {
    throw new Error("Student account not found.");
  }

  if (!course) {
    throw new Error("Course not found.");
  }

  const existingCertificate = await prisma.certificate.findFirst({
    where: {
      studentId: student.id,
      courseId: course.id,
    },
    orderBy: { issuedAt: "desc" },
  });

  if (existingCertificate) {
    return existingCertificate;
  }

  const [certificateNo, verificationId] = await Promise.all([
    generateUniqueCertificateNumber(course.title),
    generateUniqueVerificationId(course.title),
  ]);

  const teacherName =
    course.teacher?.name || issuer?.name || "Shaykh Abu Ibrahim";
  const studentName = student.name || student.email;
  const issuedAt = input.issuedAt ?? new Date();

  const certificate = await prisma.certificate.create({
    data: {
      certificateNo,
      verificationId,
      studentName,
      courseName: course.title,
      teacherName,
      issuedAt,
      studentId: student.id,
      courseId: course.id,
      issuedById: input.issuedById,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      title: "Certificate issued",
      message: `Your certificate for ${course.title} is now available in your dashboard.`,
      type: "CERTIFICATE",
    },
  });

  return certificate;
}
