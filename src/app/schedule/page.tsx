import styles from "@/app/schedule/schedule.module.css";
import ScheduleItem from "@/components/ScheduleItem/ScheduleItem";
import Motion from "@/components/motion";
import { getSchedule } from "@/lib/api";
import { style } from "motion/react-client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { Fragment } from "react";

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
        Object.entries(
          results.reduce((groups, show) => {
            const day = show.day;
            (groups[day] ??= []).push(show);
            return groups;
          }, {} as Record<number, typeof results>)
        )
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, dayShows]) => (
            <Fragment key={day}>
              <h3 className={styles.dayHeader}>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ][Number(day) - 1]}:
              </h3>

              {dayShows.map((show) => (
                <ScheduleItem key={show.id} show={show} />
              ))}
            </Fragment>
          ))
      ) : (
        <div></div>
      )}
    </Motion>
  );

}
