import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Clock3, Star, Users } from "lucide-react";
import type { Course } from "@/data/courses";
import { getCourseImagePath } from "@/utils/course-image";
import styles from "./CourseCard.module.css";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const priceLabel =
    course.price === 0 ? "Free enrollment" : `$${course.price.toFixed(0)}`;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={getCourseImagePath(course.image)}
          alt={course.title}
          width={720}
          height={420}
          className={styles.image}
        />
      </div>

      <div className={styles.topRow}>
        <span className={styles.category}>{course.category}</span>
        {course.isPopular ? <span className={styles.popular}>Popular</span> : null}
      </div>

      <h3 className={styles.title}>{course.title}</h3>

      <p className={styles.description}>{course.shortDescription}</p>

      <div className={styles.teacher}>
        <strong>{course.teacher.name}</strong>
        <span>{course.teacher.designation}</span>
      </div>

      <div className={styles.metaGrid}>
        <span>
          <Clock3 size={15} />
          {course.duration}
        </span>

        <span>
          <Users size={15} />
          {course.students}+ students
        </span>

        <span>
          <Star size={15} />
          {course.rating} rating
        </span>
      </div>

      <div className={styles.footer}>
        <div>
          <strong className={styles.price}>{priceLabel}</strong>
          <p className={styles.certificate}>
            <Award size={14} />
            {course.certificate ? "Certificate included" : "Assessment included"}
          </p>
        </div>

        <Link href={`/courses/${course.slug}`} className={styles.link}>
          Explore <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
