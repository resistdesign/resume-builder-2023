import '@picocss/pico/css/pico.min.css';
import React, { FC, useState } from 'react';
import { Form } from './System/Form';
import { Input } from './System/Input';

export const App: FC = () => {
  const [person, setPerson] = useState({});

  return (
    <Form name={'person'} value={person} onSubmit={setPerson}>
      <Input name="description" />
      <Input name="email" />
      <button type="submit">Done</button>
    </Form>
  );
};
