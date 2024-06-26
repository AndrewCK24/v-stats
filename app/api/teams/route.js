import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToMongoDB from "@/lib/connect-to-mongodb";
import User from "@/app/models/user";
import Team from "@/app/models/team";
import Member from "@/app/models/member";

export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[POST /api/users/teams] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMember = new Member({
      name: user.name,
      number: 1,
    });

    const { name, nickname } = await req.json();
    // TODO: Add validation for name and nickname
    // if there is a team with the same name, ask the user to choose another name or join the existing team
    // see issue #6
    const newTeam = new Team({
      name,
      nickname,
      members: [
        {
          _id: newMember._id,
          email: user.email,
          role: "owner",
          user_id: user._id,
        },
      ],
      lineups: new Array(3).fill({
        options: {
          liberoSwitchMode: 0,
          liberoSwitchPosition: "",
        },
        starting: new Array(6).fill({ _id: null }),
        liberos: [],
        substitutes: [],
      }),
    });

    newMember.team_id = newTeam._id;
    user.teams.joined.unshift(newTeam._id);

    await newMember.save();
    await newTeam.save();
    await user.save();

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.log("[create-team]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
