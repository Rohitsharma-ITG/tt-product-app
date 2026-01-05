import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../../components/api';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>('');
  const api = new Api();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      message.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${api.baseUrl}/app/submit-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...(userNotFound && { first_name: firstName, last_name: lastName }) // Include names if user not found
        }),
      });

      const res = await response.json();

      if (response.ok) {
        message.success('Code sent to your email.');
        setCodeSent(true); // Display the code input form
      } else if (response.status === 404 && res?.message === 'User not found') {
        setUserNotFound(true);
        message.info('User not found. Please enter your first and last name.');
      } else {
        message.error('Failed to submit email.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!authCode) {
      message.error('Please enter the authentication code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${api.baseUrl}/app/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
        credentials: 'include',
      });

      const res = await response.json();

      if (response.ok && res.status === 'success') {
        message.success('Authenticated successfully.');
        const backUrl = localStorage.getItem('ug-card-url');
        if (backUrl) {
          navigate(backUrl);
        } else {
          navigate('/apps/ugapp/cards/casting-shadows/');
        }
      } else {
        message.error(res.message || 'Invalid code.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      {!codeSent ? (
        <Form onFinish={handleSubmit}>
          <Form.Item label="Email" name="email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Item>

          {userNotFound && (
            <>
              <Form.Item label="First Name" name="firstName">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName">
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form onFinish={handleVerifyCode}>
          <Form.Item label="Authentication Code" name="code">
            <Input
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="verify-button"
            >
              Verify Code
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
