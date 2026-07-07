import type { Metadata } from "next";
import { CourseDetailPage } from "@/components/public/courses/CourseDetailPage";
import { courses, getCourseBySlug } from "@/data/courses";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = getCourseBySlug(slug);

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
