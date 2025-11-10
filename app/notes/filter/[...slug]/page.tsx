import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";


const VALID_TAGS = ["all", "work", "personal", "todo", "meeting", "shopping"];

export default async function FilterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  
  const tagRaw = slug?.[0]?.toLowerCase() ?? "all";

 
  if (!VALID_TAGS.includes(tagRaw)) {
    notFound();
  }

  
  const tag = tagRaw === "all" ? undefined : tagRaw;
  const q = typeof sp?.q === "string" ? sp.q : "";
  const page = sp?.page ? Number(sp.page) : 1;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["notes", { q, page, tag: tag ?? "" }],
    queryFn: () => fetchNotes({ q, page, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={tag ?? null} />
    </HydrationBoundary>
  );
}