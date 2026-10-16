"use client"

import styles from "@/components/PillNavbar/Pills.module.css";

import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";
import {ParsedUrlQueryInput} from "node:querystring";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {SearchIcon} from "lucide-react";

export default function PillNavbar({
  data,
  className,
  searchPage
}: {
  data: { link: string; text: string; params?: ParsedUrlQueryInput }[],
  className?: string,
  searchPage?: string,
}) {
  const path = usePathname();
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const checkParams = (p?: ParsedUrlQueryInput) => {
    if (!p) return params.size === 0;

   for (const key in p) {
    const expected = Array.isArray(p[key]) ? p[key] : [p[key]];
    const actual = params.getAll(key);

    if (expected.length !== actual.length) return false;

    const expectedSorted = [...expected].map(String).sort();
    const actualSorted = [...actual].sort();

    for (let i = 0; i < expectedSorted.length; i++) {
      if (expectedSorted[i] !== actualSorted[i]) return false;
    }
  }

    return true;
  }

  const router = useRouter();

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) return;
    const timeout = setTimeout(() => {
      router.push(`/${searchPage}?search=${encodeURIComponent(query)}`);
    }, 750);
    return () => clearTimeout(timeout);
  }, [searchQuery, router]);

  useEffect(() => {
      setSearchQuery(params.get("search") ?? "");
    }, [params]);

  const links = data.map((x, i) => {
    let link = x.link;
    if (x.params && Object.keys(x.params).length > 0) {
      let i = 0;
      for (const key in x.params) {
        if (i === 0) {
          link += `?${key}=${x.params[key]}`;
        } else {
          link += `&${key}=${x.params[key]}`
        }
      }
    }

    return (
        <li key={i}>
          <Link href={{
                  pathname: x.link,
                  query: x.params,
                }}
                prefetch={false}
                className={`${styles.pill} ${path === x.link && checkParams(x.params) ? styles.selected : ""}`}>
            {x.text}
          </Link>
        </li>
    )
  });

  return (
      <nav aria-label="Primary" className={`${styles.navbar} ${className}`}>
        <ul className={styles.pillsContainer}>
          {links}

          {searchPage && (
            <li key="search">
              <div className={styles.searchIconWrapper}>
                <SearchIcon size={20} className={`${styles.searchIcon} ${searchQuery.trim() ? styles.searchIcon_filled : ""}`}/>
              </div>
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);

                  if (!value.trim() && params.has("search")) {
                    router.push(`/${searchPage}`);
                  }
                }}
                aria-label="Search"
                className={`${styles.pill_input} ${searchQuery.trim() ? styles.pill_input_filled : ""}`}
              />
            </li>
          )}

        </ul>
      </nav>
  )
}