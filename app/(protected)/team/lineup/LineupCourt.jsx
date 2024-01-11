import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { FiRepeat, FiRotateCw } from "react-icons/fi";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/app/components/common/Court";

const LineupCourt = ({ members, editingLineup }) => {
  const dispatch = useDispatch();
  const { starters, liberos, status } = editingLineup;
  const { editingZone, editingMember } = status;

  return (
    <CourtContainer>
      <Outside className="left">
        <AdjustButton onClick={() => dispatch(teamActions.rotateLineupCw())}>
          <FiRotateCw />
          輪轉
        </AdjustButton>
        {liberos.map((libero, index) => {
          const member = members.find((m) => m._id === libero.member_id);
          return (
            <PlayerCard
              key={index}
              className={editingZone === index + 7 && "toggled"}
              onClick={() =>
                dispatch(teamActions.setEditingStatus({ zone: index + 7 }))
              }
            >
              {editingZone === index + 7 && editingMember._id ? (
                <>
                  <h3>{editingMember.number}</h3>
                  <span />
                </>
              ) : (
                <>
                  <h3>{member.number || ""}</h3>
                  {editingZone && editingZone !== index + 7 ? (
                    <FiRepeat />
                  ) : (
                    <span>{libero.position || ""}</span>
                  )}
                </>
              )}
            </PlayerCard>
          );
        })}
      </Outside>
      <Inside>
        {starters.map((starter, index) => {
          const member = members.find((m) => m._id === starter.member_id);
          return (
            <PlayerCard
              key={index}
              style={{ gridArea: `z${index + 1}` }}
              className={editingZone === index + 1 && "toggled"}
              onClick={() =>
                dispatch(teamActions.setEditingStatus({ zone: index + 1 }))
              }
            >
              {editingZone === index + 1 && editingMember._id ? (
                <>
                  <h3>{editingMember.number}</h3>
                  <span />
                </>
              ) : (
                <>
                  <h3>{member.number || ""}</h3>
                  {editingZone && editingZone !== index + 1 ? (
                    <FiRepeat />
                  ) : (
                    <span>{starter.position || ""}</span>
                  )}
                </>
              )}
            </PlayerCard>
          );
        })}
      </Inside>
      <Outside className="right" />
    </CourtContainer>
  );
};

export default LineupCourt;