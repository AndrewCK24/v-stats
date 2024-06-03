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
      console.error("[POST /api/members] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      console.error("[POST /api/members] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.json();

    // find the team
    const team = await Team.findById(formData.team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const members = await Member.find({ team_id: formData.team_id });

    // any member can create members
    const userIsMember = members.find(
      (member) => member.meta?.user_id?.toString() === user._id.toString()
    );
    if (!userIsMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // only admins can create admins
    const userIsAdmin = userIsMember.meta.admin;
    if (formData.admin && !userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasSameNumber = members.find(
      (member) => member.number === formData.number
    );
    if (hasSameNumber) {
      return NextResponse.json(
        { error: "A member with the same number already exists" },
        { status: 409 }
      );
    }

    if (formData.email) {
      const hasSameEmail = members.find(
        (member) => member.meta.email === formData.email
      );
      if (hasSameEmail) {
        return NextResponse.json(
          { error: "A member with the same email already exists" },
          { status: 409 }
        );
      }
    }

    const newMember = new Member({
      team_id: formData.team_id,
      name: formData.name,
      number: formData.number,
      meta: {
        admin: formData.admin,
        email: formData.email,
      },
    });

    // find the user and send invitation
    if (formData.email) {
      const targetUser = await User.findOne({ email: formData.email });
      if (targetUser) {
        targetUser.teams.inviting.push(formData.team_id);
        await targetUser.save();
      }
    }

    team.members.push(newMember._id);
    team.lineup.others.push(newMember._id);
    await team.save();
    await newMember.save();

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.log("[post-teams]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
