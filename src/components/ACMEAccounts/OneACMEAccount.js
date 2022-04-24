import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import InputText from '../UI/Form/InputText';
import InputSelect from '../UI/Form/InputSelect';
import InputCheckbox from '../UI/Form/InputCheckbox';
import FormInformation from '../UI/Form/FormInformation';

import Button from '../UI/Button/Button';

const OneACMEAccount = () => {
  //dummy stuff
  const dummyKeys = {
    private_keys: [
      { id: 0, name: 'Key Name', email: 'some@name.com' },
      { id: 1, name: 'Some key name', email: 'greg@gtw86.com' },
      { id: 2, name: 'My key', email: 'temp@temp.net' },
    ],
  };
  // create options array to display in our dropdown for key selection
  // Perhaps change this to name and some kind of hash or name and common name (CN)
  const privateKeyOptions = dummyKeys.private_keys.map((m) => ({
    optionValue: m.id,
    optionName: m.name + ' (' + m.email + ')',
  }));
  // end dummy stuff

  const { id } = useParams();
  const [acmeAccount, setAcmeAccount] = useState({
    account: [],
    isLoaded: false,
  });

  // function that fetches the account from the API
  const fetchAcmeAccount = () => {
    fetch(`http://localhost:4050/v1/acmeaccounts/${id}`)
      .then((response) => response.json())
      .then((json) => {
        setAcmeAccount({
          account: json.acme_account,
          isLoaded: true,
        });
      });
  };

  // form field updates
  const nameChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, name: event.target.value },
      };
    });
  };
  const emailChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, email: event.target.value },
      };
    });
  };
  const descriptionChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, description: event.target.value },
      };
    });
  };
  const privateKeyChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, private_key_id: event.target.value },
      };
    });
  };
  const tosChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, accepted_tos: event.target.checked },
      };
    });
  };
  const stagingChangeHandler = (event) => {
    setAcmeAccount((prevState) => {
      return {
        ...prevState,
        account: { ...prevState.account, is_staging: event.target.checked },
      };
    });
  };

  useEffect(() => {
    fetchAcmeAccount();
  }, []);

  if (!acmeAccount.isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>ACME Account - Edit</h2>
      <form>
        <InputText
          label='Account Name'
          id='name'
          defaultValue={acmeAccount.account.name}
          value={acmeAccount.name}
          onChange={nameChangeHandler}
        />
        <InputText
          label='E-Mail Address'
          id='email'
          defaultValue={acmeAccount.account.email}
          value={acmeAccount.email}
          onChange={emailChangeHandler}
        />
        <InputText
          label='Description'
          id='description'
          defaultValue={acmeAccount.account.description}
          value={acmeAccount.description}
          onChange={descriptionChangeHandler}
        />
        <InputSelect
          label='Private Key'
          id='privateKey'
          options={privateKeyOptions}
          defaultValue={acmeAccount.account.private_key_id}
          onChange={privateKeyChangeHandler}
        />
        <InputCheckbox
          id='acceptTos'
          checked={acmeAccount.account.accepted_tos}
          onChange={tosChangeHandler}
        >
          Accept Let's Encrypt Terms of Service
        </InputCheckbox>
        <InputCheckbox
          id='isStaging'
          checked={acmeAccount.account.is_staging}
          onChange={stagingChangeHandler}
        >
          Staging Account
        </InputCheckbox>

        <FormInformation>
          <small>Created: {acmeAccount.account.created_at}</small>
        </FormInformation>
        <FormInformation>
          <small>Last Updated: {acmeAccount.account.updated_at}</small>
        </FormInformation>

        <Button type='submit'>Submit</Button>
        <Button type='reset'>Reset</Button>
        <Button type='cancel'>Cancel</Button>
      </form>
    </>
  );
};

export default OneACMEAccount;
