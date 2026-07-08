import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container, Section } from "@/components/shared";
import { auth, getDashboardPath } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/dashboard";
import { getAdminBlogs } from "@/services/blog/blog.service";
import { getAdminBooks } from "@/services/book/book.service";
import { getAdminCourses } from "@/services/course/course.service";
import {
  createBookAction,
  createBlogAction,
  createCourseAction,
  deleteBookAction,
  deleteBlogAction,
  deleteCourseAction,
} from "./actions";
import styles from "@/components/lms/LmsExperience.module.css";

type AdmissionItem = {
  id: string;
  name: string;
  course?: string | null;
  status?: string | null;
};

type ContactItem = {
  id: string;
  name: string;
  email?: string | null;
  subject?: string | null;
};

type DashboardData = {
  users: number;
  admissions: AdmissionItem[];
  courses: unknown[];
  submissions: unknown[];
  payments: unknown[];
  certificates: unknown[];
  contacts: ContactItem[];
};

function getStatusMessage(value?: string | string[]) {
  const message = Array.isArray(value) ? value[0] : value;

  switch (message) {
    case "blog-created":
      return { tone: "success", text: "Blog successfully create ho gaya." };
    case "blog-deleted":
      return { tone: "success", text: "Blog successfully remove ho gaya." };
    case "course-created":
      return { tone: "success", text: "Course successfully create ho gaya." };
    case "course-deleted":
      return { tone: "success", text: "Course successfully remove ho gaya." };
    case "book-created":
      return { tone: "success", text: "Book successfully create ho gayi." };
    case "book-deleted":
      return { tone: "success", text: "Book successfully remove ho gayi." };
    case "blog-create-failed":
      return {
        tone: "error",
        text: "Blog create nahi ho saka. Slug ya required field check karo.",
      };
    case "blog-delete-failed":
      return { tone: "error", text: "Blog delete nahi ho saka." };
    case "course-create-failed":
      return {
        tone: "error",
        text: "Course create nahi ho saka. Slug unique hona chahiye.",
      };
    case "course-delete-failed":
      return { tone: "error", text: "Course delete nahi ho saka." };
    case "book-create-failed":
      return { tone: "error", text: "Book create nahi ho saki." };
    case "book-delete-failed":
      return { tone: "error", text: "Book delete nahi ho saki." };
    default:
      return null;
  }
}

export default async function AdminDashboardPage(props: PageProps<"/admin">) {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/admin");
  }

  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect(getDashboardPath(session.user.role));
  }

  let dashboard: DashboardData = {
    users: 0,
    admissions: [],
    courses: [],
    submissions: [],
    payments: [],
    certificates: [],
    contacts: [],
  };

  try {
    dashboard = await getAdminDashboardData();
  } catch {
    // Keep zero-state UI available even before Prisma data is seeded.
  }

  const [blogs, courses, books] = await Promise.all([
    getAdminBlogs(),
    getAdminCourses(),
    getAdminBooks(),
  ]);
  const notice = getStatusMessage(searchParams.success || searchParams.error);

  return (
    <Section>
      <Container className={styles.dashboard}>
        <div className={styles.dashboardTop}>
          <div>
            <h1>Admin Panel</h1>
            <p>
              Operational view for admissions, courses, contact submissions,
              payments, and academic workflows.
            </p>
          </div>
          <SignOutButton />
        </div>

        {notice ? (
          <div className={notice.tone === "success" ? styles.message : styles.error}>
            {notice.text}
          </div>
        ) : null}

        <div className={styles.dashboardStats}>
          <div className={styles.statCard}>
            <span>Total users</span>
            <strong>{dashboard.users}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Admissions</span>
            <strong>{dashboard.admissions.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Payments</span>
            <strong>{dashboard.payments.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Contacts</span>
            <strong>{dashboard.contacts.length}</strong>
          </div>
        </div>

        <div className={styles.dashboardPanels}>
          <div className={styles.panel}>
            <h2>Recent admissions</h2>
            <div className={styles.list}>
              {dashboard.admissions.length ? (
                dashboard.admissions.map((item: AdmissionItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.name}</strong>
                    <div className={styles.listItemMeta}>
                      {item.course || "Course to be confirmed"} •{" "}
                      {item.status || "Pending"}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Admission requests yahan show hongi jab families form submit
                  karengi.
                </div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Recent contact messages</h2>
            <div className={styles.list}>
              {dashboard.contacts.length ? (
                dashboard.contacts.map((item: ContactItem) => (
                  <div key={item.id} className={styles.listItem}>
                    <strong>{item.name}</strong>
                    <div className={styles.listItemMeta}>
                      {item.email || "No email"} •{" "}
                      {item.subject || "General inquiry"}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Structured contact inquiries ab yahan capture hongi.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.managementGrid}>
          <div className={styles.panel}>
            <h2>Blog Management</h2>
            <p className={styles.panelIntro}>
              Yahan se public blog page ke liye naye articles create karo.
            </p>
            <form action={createBlogAction} className={styles.adminForm}>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="blog-title">Title</label>
                  <input id="blog-title" name="title" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="blog-slug">Slug (optional)</label>
                  <input
                    id="blog-slug"
                    name="slug"
                    placeholder="auto-generate-ho-jayega"
                  />
                </div>
              </div>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="blog-category">Category</label>
                  <input
                    id="blog-category"
                    name="categoryName"
                    defaultValue="Quran"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="blog-status">Status</label>
                  <select id="blog-status" name="status" defaultValue="PUBLISHED">
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="blog-excerpt">Excerpt</label>
                <textarea id="blog-excerpt" name="excerpt" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="blog-content">Content</label>
                <textarea id="blog-content" name="content" required />
              </div>
              <button type="submit" className={styles.primaryAction}>
                Publish Blog
              </button>
            </form>

            <div className={styles.stackList}>
              {blogs.length ? (
                blogs.map((blog) => (
                  <div key={blog.id} className={styles.listItem}>
                    <strong>{blog.title}</strong>
                    <div className={styles.listItemMeta}>
                      {blog.category?.name || "General"} • {blog.status} •{" "}
                      {blog.author?.email || "No author email"}
                    </div>
                    <form action={deleteBlogAction} className={styles.inlineDeleteForm}>
                      <input type="hidden" name="id" value={blog.id} />
                      <button type="submit" className={styles.dangerButton}>
                        Delete
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>Database blogs abhi create nahi hue.</div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Course Management</h2>
            <p className={styles.panelIntro}>
              Yahan se public courses page ke liye database-based courses add karo.
            </p>
            <form action={createCourseAction} className={styles.adminForm}>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="course-title">Title</label>
                  <input id="course-title" name="title" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="course-slug">Slug (optional)</label>
                  <input
                    id="course-slug"
                    name="slug"
                    placeholder="auto-generate-ho-jayega"
                  />
                </div>
              </div>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="course-level">Level</label>
                  <select id="course-level" name="level" defaultValue="All Levels">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="course-status">Status</label>
                  <select id="course-status" name="status" defaultValue="PUBLISHED">
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="course-duration">Duration</label>
                  <input id="course-duration" name="duration" placeholder="8 Weeks" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="course-price">Price</label>
                  <input
                    id="course-price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue="0"
                  />
                </div>
              </div>
              <label className={styles.checkboxRow}>
                <input type="checkbox" name="featured" defaultChecked />
                <span>Feature this course on homepage</span>
              </label>
              <div className={styles.field}>
                <label htmlFor="course-description">Description</label>
                <textarea id="course-description" name="description" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="course-content">Curriculum / notes</label>
                <textarea
                  id="course-content"
                  name="content"
                  placeholder="Har line aik curriculum point ban sakti hai"
                />
              </div>
              <button type="submit" className={styles.primaryAction}>
                Create Course
              </button>
            </form>

            <div className={styles.stackList}>
              {courses.length ? (
                courses.map((course) => (
                  <div key={course.id} className={styles.listItem}>
                    <strong>{course.title}</strong>
                    <div className={styles.listItemMeta}>
                      {course.level || "All Levels"} • {course.status} •{" "}
                      {course.featured ? "Featured" : "Standard"}
                    </div>
                    <form
                      action={deleteCourseAction}
                      className={styles.inlineDeleteForm}
                    >
                      <input type="hidden" name="id" value={course.id} />
                      <button type="submit" className={styles.dangerButton}>
                        Delete
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>Database courses abhi create nahi hue.</div>
              )}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Book Management</h2>
            <p className={styles.panelIntro}>
              Library resources aur study companions yahan se manage karo.
            </p>
            <form action={createBookAction} className={styles.adminForm}>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="book-title">Title</label>
                  <input id="book-title" name="title" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="book-slug">Slug (optional)</label>
                  <input
                    id="book-slug"
                    name="slug"
                    placeholder="auto-generate-ho-jayega"
                  />
                </div>
              </div>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="book-category">Category</label>
                  <select id="book-category" name="category" defaultValue="Quran">
                    <option value="Quran">Quran</option>
                    <option value="Fiqh">Fiqh</option>
                    <option value="Aqidah">Aqidah</option>
                    <option value="Character">Character</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="book-status">Status</label>
                  <select id="book-status" name="status" defaultValue="PUBLISHED">
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className={styles.split}>
                <div className={styles.field}>
                  <label htmlFor="book-format">Format</label>
                  <input id="book-format" name="format" defaultValue="PDF Guide" required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="book-pages">Pages</label>
                  <input id="book-pages" name="pages" type="number" min="1" defaultValue="32" />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="book-summary">Summary</label>
                <textarea id="book-summary" name="summary" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="book-note">Featured note</label>
                <textarea id="book-note" name="featuredNote" />
              </div>
              <button type="submit" className={styles.primaryAction}>
                Create Book
              </button>
            </form>

            <div className={styles.stackList}>
              {books.length ? (
                books.map((book) => (
                  <div key={book.id} className={styles.listItem}>
                    <strong>{book.title}</strong>
                    <div className={styles.listItemMeta}>
                      {book.category} • {book.format} • {book.status}
                    </div>
                    <form action={deleteBookAction} className={styles.inlineDeleteForm}>
                      <input type="hidden" name="id" value={book.id} />
                      <button type="submit" className={styles.dangerButton}>
                        Delete
                      </button>
                    </form>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>Database books abhi create nahi hui.</div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
