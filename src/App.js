import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import ContactForm from './components/ContactForm/ContactForm';
import Filter from './components/Filter/Filter';
import ContactList from './components/ContactList/ContactList';

class App extends Component {
  static propTypes = {
    contacts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      }),
    ),
    filter: PropTypes.string,
  };

  state = {
    contacts: [
      // { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      // { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      // { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      // { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  handleFilter = event => {
    const { value } = event.currentTarget;

    this.setState({ filter: value });
  };

  handleNewContact = newContact => {
    const { name, number } = newContact;
    const isAlreadyInContacts = this.checkIdenticalNames(name);

    if (isAlreadyInContacts) {
      return alert(`${name} is already in contacts`);
    } else {
      this.addContact(name, number);
    }
  };

  checkIdenticalNames = name => {
    return this.state.contacts.some(contact => contact.name === name);
  };

  addContact = (name, number) => {
    const contactId = uuidv4();

    this.setState(({ contacts }) => {
      const userInfo = { id: contactId, name, number };

      return { contacts: [...contacts, userInfo] };
    });
  };

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(({ id }) => id !== contactId),
    }));
  };

  componentDidMount() {
    const cont = localStorage.getItem('contacts');
    const parsedCont = JSON.parse(cont);

    if (parsedCont) {
      this.setState({ contacts: parsedCont });
    }
    // console.log(parsedCont);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      console.log('Обновились контакты');
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { filter, contacts } = this.state;
    const normalizeFilter = filter.toLowerCase();
    const visibleContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter),
    );

    return (
      <div>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.handleNewContact} />

        <h2>Contacts</h2>
        <Filter value={filter} onFilter={this.handleFilter} />
        <ContactList
          onDeleteContact={this.deleteContact}
          visibleContacts={visibleContacts}
        />
      </div>
    );
  }
}

export default App;
