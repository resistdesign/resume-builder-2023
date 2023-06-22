import '@picocss/pico/css/pico.min.css';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Form } from './System/Form';
import { Input } from './System/Input';
// @ts-ignore
import PersonType from 'url:./Types/Person';

export const App: FC = () => {
  const [person, setPerson] = useState({});
  const loadTypes = useCallback(async () => {
    const res = await (await fetch(PersonType)).text();

    console.log(res);
  }, []);

  useEffect(() => {
    const _promise = loadTypes();
  }, [loadTypes]);

  return (
    <Form name={'person'} value={person} onSubmit={setPerson}>
      <Input name="description" />
      <Input name="email" />
      <button type="submit">Done</button>
    </Form>
  );
};
