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

    if (username === 'admin' && password.length === 10) {
      try {
        await axios.post('/api/auth', { username, password });
        navigate('/');
      } catch (error) {
        setError('Данные введены неверно, попробуйте еще раз');
      }
    } else {
      setError('Данные введены неверно, попробуйте еще раз');
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
          placeholder="Username"
          value={username}
          onChange={(e) => handleInputChange(e, 'username')}
        />
        <Input
          className={`${styles.passwordInput} ${error ? styles.errorInput : ''}`}
          type={pwdVisible ? "text" : "password"}
          placeholder="Password"
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
