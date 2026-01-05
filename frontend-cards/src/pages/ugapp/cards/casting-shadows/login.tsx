import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Api } from '../../../../components/api';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const api = new Api();

  const handleSubmit = async () => {
    if (!email) {
      message.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Pass the email as a string, not an object
      const res = await api.submitEmail(email);
      if (res?.ok) {
        message.success('Check your email for the login link.');
        setEmail('');
      } else {
        message.error('Failed to submit email.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Email" name="email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{
            backgroundColor: '#f47719',
            borderColor: '#f47719',
            color: '#ffffff',
            textTransform: 'uppercase',
            fontWeight: "bold",
            fontSize: "16px",
          }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
