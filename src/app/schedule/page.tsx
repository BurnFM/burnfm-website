
import styles from "@/app/schedule/schedule.module.css";
import ScheduleItem from "@/components/ScheduleItem/ScheduleItem";
import Motion from "@/components/motion";
import { getSchedule } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Schedule - Burn FM",
};

export const revalidate = 7200;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  if (!search || (Array.isArray(search) ? !search.some(s => s.trim()) : !search.trim())) {
    redirect("/schedule/1");
  }

  const searchQuery = (Array.isArray(search) ? search[0] : search).trim().toLowerCase();
  const shows = await getSchedule();

  const results = shows.filter((show) =>
    [
      show.title,
      ...(Array.isArray(show.hosts) ? show.hosts : []),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchQuery))
  );

  return (
    <Motion
      type="div"
      className={styles.ScheduleList}
      transition={{ duration: 0.2, type: "tween", delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {results.length > 0 ? (
        results.map((show, i) => (
          <ScheduleItem key={i} show={show} showDay={true}/>
        ))
      ) : (
        <div></div>
      )}
    </Motion>
  );
}
