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
import styles from "./page.module.css";

type AdmissionItem = {
  id: string;
  name: string;
  course?: string | null;
  status?: string | null;
  createdAt?: Date | string | null;
};

type ContactItem = {
  id: string;
  name: string;
  email?: string | null;
  subject?: string | null;
  createdAt?: Date | string | null;
};

type SubmissionItem = {
  id: string;
  status?: string | null;
  updatedAt?: Date | string | null;
  assignment?: {
    title?: string | null;
  } | null;
  student?: {
    name?: string | null;
  } | null;
};

type PaymentItem = {
  id: string;
  amount?: { toNumber(): number } | number | null;
  currency?: string | null;
  status?: string | null;
  createdAt?: Date | string | null;
  user?: {
    name?: string | null;
  } | null;
  course?: {
    title?: string | null;
  } | null;
};

type CertificateItem = {
  id: string;
  studentName?: string | null;
  courseName?: string | null;
  issuedAt?: Date | string | null;
};

type DashboardData = {
  users: number;
  admissions: AdmissionItem[];
  courses: unknown[];
  submissions: SubmissionItem[];
  payments: PaymentItem[];
  certificates: CertificateItem[];
  contacts: ContactItem[];
};

type Notice = {
  tone: "success" | "error";
  text: string;
};

function getStatusMessage(value?: string | string[]): Notice | null {
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

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "Recently";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMoney(
  amount?: { toNumber(): number } | number | null,
  currency?: string | null
) {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : amount && typeof amount === "object" && "toNumber" in amount
        ? amount.toNumber()
        : 0;

  return `${currency || "USD"} ${numericAmount}`;
}

function normalizeCountLabel(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`;
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
    // Keep the admin workspace available while database content is still sparse.
  }

  const [blogs, courses, books] = await Promise.all([
    getAdminBlogs(),
    getAdminCourses(),
    getAdminBooks(),
  ]);

  const notice = getStatusMessage(searchParams.success || searchParams.error);
  const draftBlogs = blogs.filter((item) => item.status === "DRAFT").length;
  const draftCourses = courses.filter((item) => item.status === "DRAFT").length;
  const draftBooks = books.filter((item) => item.status === "DRAFT").length;
  const totalDrafts = draftBlogs + draftCourses + draftBooks;
  const publishedContent =
    blogs.filter((item) => item.status === "PUBLISHED").length +
    courses.filter((item) => item.status === "PUBLISHED").length +
    books.filter((item) => item.status === "PUBLISHED").length;

  const priorityTasks = [
    {
      label: "Admissions awaiting review",
      value: dashboard.admissions.length,
      hint: "Follow up with interested families and confirm course fit.",
    },
    {
      label: "New contact inquiries",
      value: dashboard.contacts.length,
      hint: "Respond to questions before they turn cold.",
    },
    {
      label: "Draft content items",
      value: totalDrafts,
      hint: "Publish or archive pending content from the studio.",
    },
  ];

  return (
    <Section className={styles.adminSection}>
      <Container className={styles.dashboard}>
        <div className={styles.heroCard}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrow}>Academy control center</span>
              <span className={styles.roleBadge}>{session.user.role}</span>
            </div>
            <h1>Professional admin workspace for Shaykh Abu Ibrahim</h1>
            <p className={styles.heroText}>
              Admissions, public content, inquiries, and academic operations are
              now organized in one cleaner dashboard so the academy team can work
              faster without hunting through raw forms.
            </p>

            <div className={styles.quickActions}>
              <a href="#content-studio" className={styles.quickLink}>
                Content studio
              </a>
              <a href="#operations" className={styles.quickLink}>
                Operations
              </a>
              <a href="#blog-panel" className={styles.quickLink}>
                Blogs
              </a>
              <a href="#course-panel" className={styles.quickLink}>
                Courses
              </a>
              <a href="#book-panel" className={styles.quickLink}>
                Books
              </a>
            </div>
          </div>

          <div className={styles.heroSide}>
            <div className={styles.profileCard}>
              <div>
                <span className={styles.profileLabel}>Signed in as</span>
                <strong>{session.user.name || "Super Admin"}</strong>
              </div>
              <span className={styles.profileMeta}>{session.user.email}</span>
              <SignOutButton />
            </div>

            <div className={styles.healthCard}>
              <div className={styles.healthHeader}>
                <strong>Workspace health</strong>
                <span>{normalizeCountLabel(publishedContent, "item", "items")} live</span>
              </div>
              <div className={styles.healthRow}>
                <span>Admissions queue</span>
                <strong>{dashboard.admissions.length}</strong>
              </div>
              <div className={styles.healthRow}>
                <span>Unread-style contacts</span>
                <strong>{dashboard.contacts.length}</strong>
              </div>
              <div className={styles.healthRow}>
                <span>Content drafts</span>
                <strong>{totalDrafts}</strong>
              </div>
            </div>
          </div>
        </div>

        {notice ? (
          <div className={notice.tone === "success" ? styles.noticeSuccess : styles.noticeError}>
            {notice.text}
          </div>
        ) : null}

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span>Total users</span>
            <strong>{dashboard.users}</strong>
            <p>Registered learners, teachers, admins, and parents.</p>
          </article>
          <article className={styles.statCard}>
            <span>Content library</span>
            <strong>{blogs.length + courses.length + books.length}</strong>
            <p>Combined blogs, courses, and books currently in the database.</p>
          </article>
          <article className={styles.statCard}>
            <span>Payments tracked</span>
            <strong>{dashboard.payments.length}</strong>
            <p>Recent payment activity available for administrative review.</p>
          </article>
          <article className={styles.statCard}>
            <span>Certificates issued</span>
            <strong>{dashboard.certificates.length}</strong>
            <p>Recently generated completion records and recognitions.</p>
          </article>
        </div>

        <section id="operations" className={styles.operationsGrid}>
          <article className={`${styles.surfaceCard} ${styles.priorityPanel}`}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Daily priorities</span>
                <h2>What needs attention first</h2>
              </div>
            </div>

            <div className={styles.priorityList}>
              {priorityTasks.map((task) => (
                <div key={task.label} className={styles.priorityItem}>
                  <div>
                    <strong>{task.label}</strong>
                    <p>{task.hint}</p>
                  </div>
                  <span className={styles.priorityValue}>{task.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Recent admissions</span>
                <h2>Family intake pipeline</h2>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.admissions.length ? (
                dashboard.admissions.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.course || "Course to be confirmed"}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "NEW"}</span>
                      <small>{formatDate(item.createdAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Admission requests yahan tab show hongi jab website forms submit
                  hone shuru honge.
                </div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Contact desk</span>
                <h2>Recent inquiries</h2>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.contacts.length ? (
                dashboard.contacts.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{item.subject || "General inquiry"}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.metaLine}>{item.email || "No email"}</span>
                      <small>{formatDate(item.createdAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Contact form submissions aate hi yahan organized tareeqe se show
                  hongi.
                </div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Academic workflow</span>
                <h2>Submissions waiting in system</h2>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.submissions.length ? (
                dashboard.submissions.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.assignment?.title || "Assignment submission"}</strong>
                      <p>{item.student?.name || "Student"}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "DRAFT"}</span>
                      <small>{formatDate(item.updatedAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Assignment review activity abhi available nahi hai.
                </div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Payments</span>
                <h2>Financial activity snapshot</h2>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.payments.length ? (
                dashboard.payments.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.user?.name || "Student payment"}</strong>
                      <p>{item.course?.title || "General payment"}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.statusPill}>{item.status || "PENDING"}</span>
                      <small>{formatMoney(item.amount, item.currency)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Payment records aate hi yahan latest transaction view milega.
                </div>
              )}
            </div>
          </article>

          <article className={styles.surfaceCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionEyebrow}>Certificates</span>
                <h2>Issued recognitions</h2>
              </div>
            </div>
            <div className={styles.feedList}>
              {dashboard.certificates.length ? (
                dashboard.certificates.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div>
                      <strong>{item.studentName || "Student"}</strong>
                      <p>{item.courseName || "Course completion"}</p>
                    </div>
                    <div className={styles.feedMeta}>
                      <span className={styles.metaLine}>Issued</span>
                      <small>{formatDate(item.issuedAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  Certificates issue honge to unka recent record yahan show hoga.
                </div>
              )}
            </div>
          </article>
        </section>

        <section id="content-studio" className={styles.studioShell}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionEyebrow}>Content studio</span>
              <h2>Manage public website content</h2>
            </div>
            <p className={styles.sectionLead}>
              Public blog, course, aur library sections ke liye content yahan se
              create aur remove kiya ja sakta hai. Har panel mein live database
              entries bhi neeche visible hain.
            </p>
          </div>

          <div className={styles.contentGrid}>
            <article id="blog-panel" className={styles.studioCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Blog management</span>
                  <h3>Articles and announcements</h3>
                </div>
                <span className={styles.counterBadge}>{blogs.length}</span>
              </div>
              <form action={createBlogAction} className={styles.adminForm}>
                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Title</span>
                    <input id="blog-title" name="title" placeholder="New article title" required />
                  </label>
                  <label className={styles.field}>
                    <span>Slug</span>
                    <input
                      id="blog-slug"
                      name="slug"
                      placeholder="auto-generate-ho-jayega"
                    />
                  </label>
                </div>

                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Category</span>
                    <input
                      id="blog-category"
                      name="categoryName"
                      defaultValue="Quran"
                      required
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Status</span>
                    <select id="blog-status" name="status" defaultValue="PUBLISHED">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Excerpt</span>
                  <textarea id="blog-excerpt" name="excerpt" required />
                </label>

                <label className={styles.field}>
                  <span>Content</span>
                  <textarea id="blog-content" name="content" required />
                </label>

                <button type="submit" className={styles.primaryAction}>
                  Publish blog
                </button>
              </form>

              <div className={styles.recordList}>
                {blogs.length ? (
                  blogs.map((blog) => (
                    <div key={blog.id} className={styles.recordItem}>
                      <div className={styles.recordTop}>
                        <strong>{blog.title}</strong>
                        <span className={styles.statusPill}>{blog.status}</span>
                      </div>
                      <p className={styles.recordMeta}>
                        {blog.category?.name || "General"} | {blog.author?.email || "No author email"}
                      </p>
                      <form action={deleteBlogAction} className={styles.inlineAction}>
                        <input type="hidden" name="id" value={blog.id} />
                        <button type="submit" className={styles.dangerButton}>
                          Delete
                        </button>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>Database blogs abhi create nahi hue.</div>
                )}
              </div>
            </article>

            <article id="course-panel" className={styles.studioCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Course management</span>
                  <h3>Programs and featured offerings</h3>
                </div>
                <span className={styles.counterBadge}>{courses.length}</span>
              </div>
              <form action={createCourseAction} className={styles.adminForm}>
                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Title</span>
                    <input id="course-title" name="title" placeholder="Course title" required />
                  </label>
                  <label className={styles.field}>
                    <span>Slug</span>
                    <input
                      id="course-slug"
                      name="slug"
                      placeholder="auto-generate-ho-jayega"
                    />
                  </label>
                </div>

                <div className={styles.formTriple}>
                  <label className={styles.field}>
                    <span>Level</span>
                    <select id="course-level" name="level" defaultValue="All Levels">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Status</span>
                    <select id="course-status" name="status" defaultValue="PUBLISHED">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Price</span>
                    <input
                      id="course-price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      defaultValue="0"
                    />
                  </label>
                </div>

                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Duration</span>
                    <input id="course-duration" name="duration" placeholder="8 Weeks" />
                  </label>
                  <label className={styles.checkboxField}>
                    <input type="checkbox" name="featured" defaultChecked />
                    <span>Feature this course on homepage</span>
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Description</span>
                  <textarea id="course-description" name="description" required />
                </label>

                <label className={styles.field}>
                  <span>Curriculum / notes</span>
                  <textarea
                    id="course-content"
                    name="content"
                    placeholder="Har line aik curriculum point ban sakti hai"
                  />
                </label>

                <button type="submit" className={styles.primaryAction}>
                  Create course
                </button>
              </form>

              <div className={styles.recordList}>
                {courses.length ? (
                  courses.map((course) => (
                    <div key={course.id} className={styles.recordItem}>
                      <div className={styles.recordTop}>
                        <strong>{course.title}</strong>
                        <span className={styles.statusPill}>{course.status}</span>
                      </div>
                      <p className={styles.recordMeta}>
                        {course.level || "All Levels"} |{" "}
                        {course.featured ? "Featured on homepage" : "Standard visibility"}
                      </p>
                      <form action={deleteCourseAction} className={styles.inlineAction}>
                        <input type="hidden" name="id" value={course.id} />
                        <button type="submit" className={styles.dangerButton}>
                          Delete
                        </button>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>Database courses abhi create nahi hue.</div>
                )}
              </div>
            </article>

            <article id="book-panel" className={styles.studioCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Book management</span>
                  <h3>Library and downloadable resources</h3>
                </div>
                <span className={styles.counterBadge}>{books.length}</span>
              </div>
              <form action={createBookAction} className={styles.adminForm}>
                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Title</span>
                    <input id="book-title" name="title" placeholder="Book title" required />
                  </label>
                  <label className={styles.field}>
                    <span>Slug</span>
                    <input
                      id="book-slug"
                      name="slug"
                      placeholder="auto-generate-ho-jayega"
                    />
                  </label>
                </div>

                <div className={styles.formTriple}>
                  <label className={styles.field}>
                    <span>Category</span>
                    <select id="book-category" name="category" defaultValue="Quran">
                      <option value="Quran">Quran</option>
                      <option value="Fiqh">Fiqh</option>
                      <option value="Aqidah">Aqidah</option>
                      <option value="Character">Character</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Status</span>
                    <select id="book-status" name="status" defaultValue="PUBLISHED">
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Pages</span>
                    <input
                      id="book-pages"
                      name="pages"
                      type="number"
                      min="1"
                      defaultValue="32"
                    />
                  </label>
                </div>

                <div className={styles.formSplit}>
                  <label className={styles.field}>
                    <span>Format</span>
                    <input
                      id="book-format"
                      name="format"
                      defaultValue="PDF Guide"
                      required
                    />
                  </label>
                  <div className={styles.tipCard}>
                    <strong>Resource tip</strong>
                    <p>
                      Short PDF guides, workbooks, aur revision companions is section
                      mein best perform karte hain.
                    </p>
                  </div>
                </div>

                <label className={styles.field}>
                  <span>Summary</span>
                  <textarea id="book-summary" name="summary" required />
                </label>

                <label className={styles.field}>
                  <span>Featured note</span>
                  <textarea id="book-note" name="featuredNote" />
                </label>

                <button type="submit" className={styles.primaryAction}>
                  Create book
                </button>
              </form>

              <div className={styles.recordList}>
                {books.length ? (
                  books.map((book) => (
                    <div key={book.id} className={styles.recordItem}>
                      <div className={styles.recordTop}>
                        <strong>{book.title}</strong>
                        <span className={styles.statusPill}>{book.status}</span>
                      </div>
                      <p className={styles.recordMeta}>
                        {book.category} | {book.format} | {book.pages} pages
                      </p>
                      <form action={deleteBookAction} className={styles.inlineAction}>
                        <input type="hidden" name="id" value={book.id} />
                        <button type="submit" className={styles.dangerButton}>
                          Delete
                        </button>
                      </form>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>Database books abhi create nahi hui.</div>
                )}
              </div>
            </article>
          </div>
        </section>
      </Container>
    </Section>
  );
}
