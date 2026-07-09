import { cookies } from "next/headers";
import { Container, Section } from "@/components/shared";
import { getLocaleFromCookies } from "@/lib/locale";
import { statistics } from "@/data/statistics";
import styles from "./Statistics.module.css";

const statisticsTranslations = {
  en: statistics,
  ur: [
    {
      id: "stat-1",
      value: "1,200+",
      label: "فعال طلبہ",
      detail: "قرآن، حفظ، تجوید، اور اسلامی علوم کے مختلف پروگرامز میں",
    },
    {
      id: "stat-2",
      value: "96%",
      label: "ریٹینشن ریٹ",
      detail: "منظم رہنمائی، فیڈبیک، اور لچکدار شیڈول کی بدولت",
    },
    {
      id: "stat-3",
      value: "40+",
      label: "ہفتہ وار لائیو سیشنز",
      detail: "بچوں، بڑوں، بہنوں، اور سنجیدہ طلبہ کے لیے",
    },
    {
      id: "stat-4",
      value: "8",
      label: "اہم پروگرامز",
      detail: "ابتدائی حروف سے گہری دینی سمجھ تک رہنمائی کے لیے",
    },
  ],
  ar: [
    {
      id: "stat-1",
      value: "1,200+",
      label: "طلاب نشطون",
      detail: "عبر مسارات القرآن والحفظ والتجويد والدراسات الإسلامية",
    },
    {
      id: "stat-2",
      value: "96%",
      label: "معدل الاستمرار",
      detail: "مدفوع بالمسارات المنظمة والتغذية الراجعة والجدولة المرنة",
    },
    {
      id: "stat-3",
      value: "40+",
      label: "جلسات مباشرة أسبوعياً",
      detail: "للأطفال والبالغين والأخوات والدارسين المتقدمين",
    },
    {
      id: "stat-4",
      value: "8",
      label: "برامج أساسية",
      detail: "مصممة لدعم المتعلم من الحروف الأولى إلى الفهم العميق",
    },
  ],
} as const;

export async function Statistics() {
  const locale = getLocaleFromCookies(await cookies());
  const items = statisticsTranslations[locale];

  return (
    <Section variant="white" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {items.map((stat) => (
            <article key={stat.id} className={styles.card}>
              <strong>{stat.value}</strong>
              <h2>{stat.label}</h2>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
