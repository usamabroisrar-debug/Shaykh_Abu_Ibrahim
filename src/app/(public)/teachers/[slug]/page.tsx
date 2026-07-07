import type { Metadata } from "next";
import { TeacherDetailPage } from "@/components/public/teachers/TeacherDetailPage";
import { getTeacherBySlug, teachers } from "@/data/teachers";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return teachers.map((teacher) => ({ slug: teacher.slug }));
}

export async function generateMetadata(
  props: PageProps<"/teachers/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const teacher = getTeacherBySlug(slug);

  if (!teacher) {
    return buildMetadata({
      title: "Teacher Not Found",
      description: "This teacher profile could not be found.",
      path: `/teachers/${slug}`,
    });
  }

  return buildMetadata({
    title: `${teacher.name} | ${teacher.designation}`,
    description: teacher.summary,
    path: `/teachers/${teacher.slug}`,
    keywords: [teacher.name, teacher.specialty, ...teacher.languages],
  });
}

export default async function TeacherDetailRoute(
  props: PageProps<"/teachers/[slug]">
) {
  const { slug } = await props.params;
  return <TeacherDetailPage slug={slug} />;
}
