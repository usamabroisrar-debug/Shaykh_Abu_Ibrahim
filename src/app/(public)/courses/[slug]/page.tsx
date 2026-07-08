import type { Metadata } from "next";
import { CourseDetailPage } from "@/components/public/courses/CourseDetailPage";
import { buildMetadata } from "@/lib/metadata";
import { getPublicCourseBySlug } from "@/services/course/course.service";

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await getPublicCourseBySlug(slug);

  if (!course) {
    return buildMetadata({
      title: "Course Not Found",
      description: "This course could not be found.",
      path: `/courses/${slug}`,
    });
  }

  return buildMetadata({
    title: course.seo.title,
    description: course.seo.description,
    path: `/courses/${course.slug}`,
    keywords: course.seo.keywords,
  });
}

export default async function CourseDetailRoute(
  props: PageProps<"/courses/[slug]">
) {
  const { slug } = await props.params;
  return <CourseDetailPage slug={slug} />;
}
