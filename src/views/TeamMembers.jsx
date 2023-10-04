import { useSelector } from "react-redux";

import store from "../store";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  LinkSet,
  LinkButton,
} from "../components/common/List";
import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { GoArrowSwitch } from "react-icons/go";

const TeamMembersPage = () => {
  const { name, members } = useSelector((state) => state.team);

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>
          {name}
          <LinkButton to="/team/list">
            <GoArrowSwitch />
          </LinkButton>
        </ListTitle>
        <LinkSet>
          <LinkButton to="/team/list">
            <BsGrid3X2Gap />
          </LinkButton>
          <LinkButton to="/team/new">
            <FiEdit3 />
          </LinkButton>
        </LinkSet>
      </ListHeader>
      {members.map((member, index) => (
        <MemberCard key={index} index={index} member={member} />
      ))}
      {members[members.length - 1]?.isNew || <NewMemberBtn />}
    </ListContainer>
  );
};

export default TeamMembersPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊員名單" });
  return null;
};