import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "chemicals.json");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
    let existing: any[] = [];
    try {
      const raw = await fs.readFile(dataPath, "utf-8");
      existing = JSON.parse(raw || "[]");
    } catch (e) {
      existing = [];
    }

    const newItem = { id: Date.now().toString(), ...body };
    existing.push(newItem);
    await fs.writeFile(dataPath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    const list = JSON.parse(raw || "[]");
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}
