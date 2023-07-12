import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type SpotifyArtist = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

type TopSpotifyArtists = {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
};

export const spotifyRouter = createTRPCRouter({
  getTopArtists: protectedProcedure.query(async ({ ctx }) => {
    const { token } = ctx.session;
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=50",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching top artists",
      });
    const data = (await response.json()) as TopSpotifyArtists;
    return data.items;
  }),
});
