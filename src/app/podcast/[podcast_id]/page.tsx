import PodcastsIcon from "@/../public/Podcasts_icon.svg";
import SpotifyIcon from "@/../public/Spotify_icon.svg";
import styles from "@/app/show/[show_id]/show.module.css";
import buttons from "@/app/styles/buttons.module.css";
import Motion from "@/components/motion";
import { getPodcast } from "@/lib/api";
import { PodcastIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ podcast_id: string }>;
}): Promise<Metadata> {
  const { podcast_id } = await params;
  const id = parseInt(podcast_id);

  try {
    const podcast = await getPodcast(id);
    if (podcast)
      return {
        title: podcast.title + " - Burn FM",
      };
  } catch (e) {}

  return {
    title: "Burn FM",
  };
}

export const revalidate = 7200;

export default async function Page({
  params,
}: {
  params: Promise<{ podcast_id: string }>;
}) {
  const { podcast_id } = await params;
  const id = parseInt(podcast_id);
  if (isNaN(id)) return notFound();

  const podcast = await getPodcast(id);

  if (!podcast) return notFound();

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }

  return (
    <Motion
      type={"div"}
      className={styles.root}
      transition={{ duration: 0.2, type: "tween", delay: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.hero}>
        {podcast.photo ? (
          <Image
            className={styles.image}
            src={`https://api.burnfm.com/uploads/podcast_img/${podcast.photo}`}
            alt={`Cover photo for ${podcast.title}`}
            height={400}
            width={400}
            priority
          />
        ) : (
          <PodcastIcon size={100} className="text-white" />
        )}

        <h1 className={`notranslate ${styles.title}`}>{podcast.title}</h1>
        {podcast.hosts && (
          <h3 className={styles.sectionHeader}>
            Presented by{" "}
            {podcast.hosts.length > 1 ? (
              <>
                <strong>{podcast.hosts.slice(0, -1).join(", ")}</strong> and{" "}
                <strong>{podcast.hosts[podcast.hosts.length - 1]}</strong>
              </>
            ) : (
              <strong>{podcast.hosts[0]}</strong>
            )}
          </h3>
        )}
      </div>

      <div className={styles.details}>
        {podcast.description ? (
          <p className={styles.description}>{podcast.description}</p>
        ) : (
          <p className={styles.placeholderText}>
            This podcast has no description
          </p>
        )}
      </div>

      <div>
        {podcast.startDate != "0000-00-00" ? (
          <div
            className={styles.details}
            style={{ gap: "0px !important", paddingTop: "0px !important" }}
          >
            <h2>Podcast running:</h2>
            {podcast.endDate != "0000-00-00" ? (
              <div>
                {formatDate(podcast.startDate)} to {formatDate(podcast.endDate)}
              </div>
            ) : (
              <div>{formatDate(podcast.startDate)} to present</div>
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.onDemand}>
        <h2>On demand</h2>
        {podcast.latestShow ? (
          <div>
            <p>Latest Episode:</p>
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: "12px", marginBottom: "32px" }}
              src={
                "https://open.spotify.com/embed/episode/" +
                podcast.latestShow +
                "?utm_source=generator"
              }
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        ) : (
          <div></div>
        )}

        <div
          style={{ borderRadius: "15px" }}
          className="relative space-y-8 bg-neutral-900 py-8 px-8 overflow-clip text-white"
        >
          <PodcastIcon
            size={200}
            className="absolute -bottom-[50px] -right-[50px] text-yellow-300 z-0"
          />

          <div className="relative max-w-md pr-24">
            <h2 className="mb-2">
              Burn <span className="text-yellow-300">Podcasts</span>
            </h2>
            <p>
              Burn FM doesn&apos;t just do radio - we also have a large and
              vibrant community of podcasters.
            </p>
          </div>

          <div
            className={styles.cardButtons}
            style={{ display: "flex", gap: "16px" }}
          >
            <a
              className={buttons.Button}
              href={"https://open.spotify.com/show/0ALexnN0yS3OX4xdiPetic"}
            >
              <Image
                src={SpotifyIcon}
                alt={"Spotify icon"}
                height={28}
                width={28}
              />
              Listen on Spotify
            </a>
            <a
              className={buttons.Button}
              href={
                "https://podcasts.apple.com/us/podcast/burn-fm/id1521913304"
              }
            >
              <Image
                src={PodcastsIcon}
                alt={"Apple Podcasts icon"}
                height={28}
                width={28}
              />
              Listen on Apple Podcasts
            </a>
          </div>
        </div>
      </div>
    </Motion>
  );
}
