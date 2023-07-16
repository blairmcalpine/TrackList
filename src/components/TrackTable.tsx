import type { SpotifyTrack } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { defaultImage } from "./AuthBar";
import Table, { SortIcon, type SortDirection, type TableProps } from "./Table";

type TrackTableProps = Omit<
  TableProps<SpotifyTrack>,
  "Row" | "SkeletonRow" | "items" | "HeaderRow"
> & {
  tracks: SpotifyTrack[] | undefined;
};

export default function TrackTable({ tracks, ...rest }: TrackTableProps) {
  return (
    <Table
      items={tracks}
      HeaderRow={HeaderRow}
      Row={Row}
      SkeletonRow={SkeletonRow}
      {...rest}
    />
  );
}

function HeaderRow({
  sortColumn,
  sortType,
}: {
  sortColumn: (category: keyof SpotifyTrack) => void;
  sortType: [keyof SpotifyTrack, SortDirection] | null;
}) {
  return (
    <tr>
      <th className="sticky top-0 w-[4%] whitespace-nowrap border-b-[1px] bg-elevated pb-2 pt-5 text-right font-thinned text-gray">
        #
      </th>
      <th className="sticky top-0 z-10 w-[82px] border-b-[1px] bg-elevated text-gray"></th>
      <th className="sticky top-0 z-10 w-[34%] border-b-[1px] bg-elevated pb-2 pt-5 text-left font-thinned text-gray">
        <button
          className="flex items-center gap-2 hover:text-white"
          onClick={() => sortColumn("name")}
        >
          Title
          <SortIcon sortType={sortType} category={"name"} />
        </button>
      </th>
      <th className="sticky top-0 z-10 w-[34%] border-b-[1px] bg-elevated pb-2 pt-5 text-left font-thinned text-gray">
        <button
          className="flex items-center gap-2 hover:text-white"
          onClick={() => sortColumn("album")}
        >
          Album
          <SortIcon sortType={sortType} category={"album"} />
        </button>
      </th>
      <th className="sticky top-0 z-10 w-[14%] border-b-[1px] bg-elevated pb-2 pt-5 text-left font-thinned text-gray">
        <button
          className="flex items-center gap-2 hover:text-white"
          onClick={() => sortColumn("duration_ms")}
        >
          Duration
          <SortIcon sortType={sortType} category={"duration_ms"} />
        </button>
      </th>
      <th className="sticky top-0 z-10 w-[14%] border-b-[1px] bg-elevated pb-2 pt-5 font-thinned text-gray">
        <div className="flex justify-end">
          <button
            className="flex items-center justify-end gap-2 text-right hover:text-white"
            onClick={() => sortColumn("popularity")}
          >
            <SortIcon sortType={sortType} category={"popularity"} />
            Popularity
          </button>
        </div>
      </th>
    </tr>
  );
}

function Row({ item, idx }: { item: SpotifyTrack; idx: number }) {
  const { name, album, popularity, explicit, artists, duration_ms } = item;
  const mins = Math.floor(duration_ms / 60000);
  const seconds = String(((duration_ms % 60000) / 1000).toFixed(0)).padStart(
    2,
    "0"
  );
  const artistElements = artists.map((artist, idx) => (
    <Fragment key={idx}>
      <Link
        className="hover:text-white hover:underline"
        href={`/artist/${artist.id}`}
      >
        {artist.name}
      </Link>
      {idx !== artists.length - 1 && <span>, </span>}
    </Fragment>
  ));
  return (
    <tr className="group hover:bg-white hover:bg-opacity-10">
      <td className="text-right font-thinned text-gray">{idx + 1}</td>
      <td>
        <Image
          className="mx-auto my-1.5 h-14 w-14 object-cover"
          src={album.images[0]?.url ?? defaultImage}
          alt={album.name}
          width={56}
          height={56}
        />
      </td>
      <td>
        <div className="flex flex-col pr-2">
          <p className="truncate">{name}</p>
          <div className="flex items-center gap-1">
            {explicit && (
              <div className="grid h-4 w-4 min-w-[1rem] place-items-center rounded-sm bg-explicit">
                <p className="mt-0.5 text-2xs text-black">E</p>
              </div>
            )}
            <div className="truncate font-thinned text-sm capitalize text-gray">
              {artistElements}
            </div>
          </div>
        </div>
      </td>
      <td className="truncate font-thinned text-gray">{album.name}</td>
      <td className="truncate font-thinned text-gray">
        {mins}:{seconds}
      </td>
      <td className="text-right">
        <p className="pr-3">{popularity}%</p>
      </td>
    </tr>
  );
}

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <tr>
      <td className="text-right font-thinned text-gray">{idx + 1}</td>
      <td>
        <div className="m-auto h-14 w-14 animate-pulse rounded-full bg-highlighted" />
      </td>
      <td>
        <div className="flex flex-col py-3">
          <div className="my-1 h-4 w-[80%] animate-pulse rounded-full bg-highlighted" />
          <div className="my-[3px] h-3.5 w-[95%] animate-pulse rounded-full bg-highlighted" />
        </div>
      </td>
      <td>
        <div className="h-4 w-[70%] animate-pulse rounded-full bg-highlighted" />
      </td>
      <td>
        <div className="h-4 w-[50%] animate-pulse rounded-full bg-highlighted" />
      </td>
      <td>
        <div className="flex items-center justify-end">
          <div className="my-1 h-4 w-6 animate-pulse rounded-full bg-highlighted" />
        </div>
      </td>
    </tr>
  );
}
