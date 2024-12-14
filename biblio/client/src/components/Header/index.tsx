import "./Header.css";
import { Button } from "@consta/uikit/Button";
import { Avatar } from "@consta/uikit/Avatar";
import { User } from "@consta/uikit/User";
import { Popover } from "@consta/uikit/Popover";
import { IconSearchStroked } from "@consta/icons/IconSearchStroked";
import { IconBookmarkStroked } from "@consta/icons/IconBookmarkStroked";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetFavoritesQuery,
  useLazyLogoutQuery,
  useMeQuery,
} from "../../store/api/myapi";
import { IconExit } from "@consta/icons/IconExit";

function Header() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const navigate = useNavigate();

  const { data: userData } = useMeQuery();
  const { data: favorites } = useGetFavoritesQuery();

  const [apiLogout] = useLazyLogoutQuery();

  const handleClickOnAnchor = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (userData) {
      setUserName(userData.data.name);
      setUserEmail(userData.data.email);
    }
  }, [userData]);

  return (
    <div className="header">
      <div className="header__wrapper">
        <Avatar name="В" className="header__title" />
      </div>
      <div className="header__wrapper">
        <Button
          label="Поиск книг"
          view="clear"
          form="round"
          iconLeft={IconSearchStroked}
          onClick={() => navigate("/")}
          size="s"
        />
        <Button
          label={`Избранное (${favorites?.length})`}
          view="clear"
          form="round"
          iconLeft={IconBookmarkStroked}
          onClick={() => navigate("/favorites")}
          size="s"
        />
        <User
          name={userName}
          info={userEmail}
          ref={anchorRef}
          onClick={handleClickOnAnchor}
        />
        {isPopoverVisible && (
          <>
            {/*@ts-ignore*/}
            <Popover
              direction="downCenter"
              spareDirection="downStartLeft"
              offset="2xs"
              arrowOffset={0}
              onClickOutside={() => setIsPopoverVisible(false)}
              isInteractive={true}
              anchorRef={anchorRef}
              equalAnchorWidth={false}
              placeholder=""
            >
              <div className="popover">
                <Button
                  label={"Выйти"}
                  view="clear"
                  onClick={() => {
                    apiLogout().then(() => navigate("/auth"));
                  }}
                  iconLeft={IconExit}
                />
              </div>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
