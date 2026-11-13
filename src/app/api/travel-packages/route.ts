import { NextResponse } from "next/server";
import { connection } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import { parseTravelPackageInput } from "@/lib/travel-package";
import {
  buildTravelPackageQuery,
  parseTravelPackageFilters,
} from "@/lib/travel-packages-query";
import { TravelPackageModel } from "@/models/travel-package";

export async function GET(request: Request) {
  await connection();

  const parsed = parseTravelPackageFilters(new URL(request.url).searchParams);

  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { message: "Database is not configured. Set MONGODB_URI in .env.local." },
      { status: 503 },
    );
  }

  try {
    await connectToDatabase();

    const { filter, sort } = buildTravelPackageQuery(parsed.filters);

    const [packages, total] = await Promise.all([
      TravelPackageModel.find(filter).sort(sort).limit(100).lean(),
      TravelPackageModel.countDocuments(filter),
    ]);

    return NextResponse.json({ packages, total });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not read travel packages.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  await connection();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = parseTravelPackageInput(body);

  if (!parsed.ok) {
    return NextResponse.json(
      { message: "Validation failed.", errors: parsed.errors },
      { status: 422 },
    );
  }

  if (!isMongoConfigured()) {
    return NextResponse.json(
      { message: "Database is not configured. Set MONGODB_URI in .env.local." },
      { status: 503 },
    );
  }

  try {
    await connectToDatabase();

    const created = await TravelPackageModel.create({
      ...parsed.data,
      departureDate: new Date(parsed.data.departureDate),
    });

    return NextResponse.json(
      { message: "Travel package created.", package: created },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: Object.fromEntries(
            Object.entries(error.errors).map(([field, issue]) => [
              field,
              issue.message,
            ]),
          ),
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Could not create the travel package.",
      },
      { status: 500 },
    );
  }
}
