import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SERVICE_ICONS } from "@/components/ui/Icons";
import { SERVICES } from "@/lib/constants";

export default function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="bg-turtle-50/50 py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading>{t("heading")}</SectionHeading>
        </ScrollReveal>
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {SERVICES.map((service, i) => (
            <div key={service.key} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <ServiceCard
                icon={SERVICE_ICONS[service.key]}
                title={t(`${service.key}.title`)}
                description={t(`${service.key}.description`)}
                index={i}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
