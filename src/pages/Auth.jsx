import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import styles from "../styles/Auth.module.css";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pwdVisible, setPwdVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState({ access: "", refresh: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(!(username.trim() && password.trim()));
  }, [username, password]);

  const handlePasswordVisible = () => {
    setPwdVisible(!pwdVisible);
  };

  const handleInputChange = (e, type) => {
    if (error) setError("");
    const value = e.target.value;
    if (type === 'username') {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const response = await axios.post('https://muha-backender.org.kg/accounts/admin-login/', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.access) {
        setTokens({ access: response.data.access, refresh: response.data.refresh });

        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        navigate('/');
      } else {
        throw new Error('Ошибка авторизации');
      }
    } catch (error) {
      setError('Логин или пароль неверный, попробуйте еще раз');
    }
  };



  return (
    <div className={styles.auth}>
      <div className={styles.block}>
        <h1>Вход</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <Input
          className={`${styles.textInput} ${error ? styles.errorInput : ''}`}
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => handleInputChange(e, 'username')}
        />
        <Input
          className={`${styles.passwordInput} ${error ? styles.errorInput : ''}`}
          type={pwdVisible ? "text" : "password"}
          placeholder="Пароль"
          value={password}
          onChange={(e) => handleInputChange(e, 'password')}
          suffix={
            pwdVisible ? (
              <EyeOutlined onClick={handlePasswordVisible} />
            ) : (
              <EyeInvisibleOutlined onClick={handlePasswordVisible} />
            )
          }
        />
        <button
          className={`${styles.button} ${isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled}`}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default Auth;
