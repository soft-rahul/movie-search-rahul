import { useState, useRef , ChangeEvent} from "react";

import { useQuery, useLazyQuery } from "@apollo/client";
import { IoCreate } from "react-icons/io5";
import { LuFilterX } from "react-icons/lu";

import { FcFilledFilter, FcClearFilters } from "react-icons/fc";

import {
  GET_USER,
  GET_USER_ROLE_AND_STATUS,
  GET_USER_BY_ROLE_ID_AND_STATUS_ID,
} from "../Queries/queries";

import { Modal } from "react-responsive-modal";

import UserCard from "./UserCard";
import NewUserForm from "./NewUserForm";
import Loader from "../Components/Loader";
import { ButtonAction } from "../Components/Button";

import styled from "styled-components";
import useTheme from "../Hooks/useTheme";
import { TextWithIconWrapper } from "../Common/UI";
const UserWrapper = styled.section`
  margin: 1rem auto;
  padding: 1rem;
  max-width: 1080px;
`;

const UL = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  border: 2px solid #9f72f1;
`;

const Select = styled.select`
  display: inline-block;
  margin: 0 0.5rem;
  padding: 0.5rem;
  border-color: #d1d1d1;
  border-style: solid;
`;

const FilterMenu = styled.section`
  display: flex;
  align-items: center;
`;

const User = () => {
  const theme = useTheme();

  const roleRef = useRef<HTMLSelectElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);

  const { loading, data } = useQuery(GET_USER);
  const [getData, { loading: filterLoading, data: filterData }] = useLazyQuery(
    GET_USER_BY_ROLE_ID_AND_STATUS_ID
  );

  const [isFiltered, setIsFiltered] = useState(false);
  const clearFilterHandler = () => {
    setIsFiltered(false);
  };
  const applyFilterHandler = () => {
    getData({
      variables: {
        roleID: roleRef?.current?.value,
        statusID: statusRef?.current?.value,
      },
    });
    setIsFiltered(true);
  };

  const [modalStatus, setModalStatus] = useState(false);
  const { data: otherData } = useQuery(GET_USER_ROLE_AND_STATUS);
 
  const roleChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };
  const statusChangeHandler = (event: any) => {
    // console.log(statusRef.current.value);
  };

  const closeModalHandler = () => {
    setModalStatus(false);
  };
  const createNewUserHandler = () => {
    setModalStatus(true);
  };

  if (loading || filterLoading) return <Loader />;
  return (
    <UserWrapper>
      <FilterWrapper style={theme}>
        <FilterMenu>Filter User</FilterMenu>
        <FilterMenu>
          <Select ref={roleRef} onChange={roleChangeHandler}>
            <option value="N/A">Select Role</option>
            {otherData?.user_role?.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.role?.toUpperCase()}
              </option>
            ))}
          </Select>
          <Select ref={statusRef} onChange={statusChangeHandler}>
            <option value="N/A">Select Status</option>
            {otherData?.user_status?.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.status?.toUpperCase()}
              </option>
            ))}
          </Select>
          <div>
            <ButtonAction onClick={applyFilterHandler}>
              <TextWithIconWrapper>
                Apply <FcFilledFilter />
              </TextWithIconWrapper>
            </ButtonAction>
            <ButtonAction onClick={clearFilterHandler}>
              <TextWithIconWrapper>
                Clear <FcClearFilters />
              </TextWithIconWrapper>
            </ButtonAction>
          </div>
        </FilterMenu>
      </FilterWrapper>
      <div>
        <ButtonAction onClick={createNewUserHandler} color="#000000">
          Create New User <IoCreate size={"1rem"} />
        </ButtonAction>
        {modalStatus && (
          <Modal open={modalStatus} onClose={closeModalHandler} center>
            <div>
              <NewUserForm closeModal={closeModalHandler} />
            </div>
          </Modal>
        )}
      </div>
      <div>
        <UL>
          {!isFiltered &&
            data?.user?.map((u: any) => (
              <UserCard
                key={u.id}
                first_name={u.first_name}
                last_name={u.last_name}
                id={u.id}
                role={u.user_role.role}
                status={u?.user_status?.status}
              />
            ))}
          {isFiltered &&
            filterData?.user?.map((u: any) => (
              <UserCard
                key={u.id}
                first_name={u.first_name}
                last_name={u.last_name}
                id={u.id}
                role={u.user_role.role}
                status={u?.user_status?.status}
              />
            ))}
          {/* {filteredUsers?.map((user: any) => (
            <UserCard
              key={user.id}
              first_name={user.first_name}
              last_name={user.last_name}
              id={user.id}
              role={user.user_role.role}
              status={user?.user_status?.status}
            />
          ))} */}
        </UL>
      </div>
    </UserWrapper>
  );
};

export default User;
