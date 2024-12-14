import { useState } from "react";
import { Card } from "@consta/uikit/Card";
import { Text } from "@consta/uikit/Text";
import { TextField } from "@consta/uikit/TextField";
import { Button } from "@consta/uikit/Button";
import { toast } from "react-toastify";
import { useLoginMutation, useRegisterMutation } from "../store/api/myapi";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isRegistration, setIsRegistration] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");

  const [apiLogin] = useLoginMutation();
  const [apiRegister] = useRegisterMutation();

  const handleClickButton = () => {
    if (isRegistration) {
      if(password !== repeatPassword) {
        toast.error("Пароли должны быть одинаковыми")
        return
      }
      apiRegister({email, password, name}).then((res) => {
        if (res["error"]) {
          toast.error("Ошибка при регистрации");
        } else {
          localStorage.setItem("accessToken", res.data.data.tokens.accessToken);
          navigate("/");
        }
      })
    } else {
      apiLogin({ email, password }).then((res) => {
        if (res["error"]) {
          toast.error("Неправильная почта или пароль");
        } else {
          localStorage.setItem("accessToken", res.data.data.tokens.accessToken);
          navigate("/");
        }
      });
    }
  };

  return (
    <div className="authContainer">
      <Card verticalSpace="l" horizontalSpace="l" className="authCard">
        <Text view="primary" size="3xl" weight="bold">
          {isRegistration ? "Регистрация" : "Авторизация"}
        </Text>
        <TextField
          placeholder="Почта"
          value={email}
          onChange={(value) => setEmail(value || "")}
        />
        <TextField
          placeholder="Пароль"
          value={password}
          onChange={(value) => setPassword(value || "")}
          type="password"
        />
        {isRegistration && (
          <>
            <TextField
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(value) => setRepeatPassword(value || "")}
              type="password"
            />
            <TextField
              placeholder="Фамилия Имя"
              value={name}
              onChange={(value) => setName(value || "")}
            />
          </>
        )}
        <Text
          view="link"
          onClick={() => setIsRegistration(!isRegistration)}
          style={{ cursor: "pointer" }}
        >
          {!isRegistration ? "Регистрация" : "Авторизация"}
        </Text>
        <Button
          label={isRegistration ? "Зарегистрироваться" : "Войти"}
          form="round"
          onClick={handleClickButton}
        />
      </Card>
    </div>
  );
};

export default Auth;
