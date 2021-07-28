import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ChatHistoryItem from "./ChatHistoryItem";
import { IconButton, Divider, ListItem } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  List : {
    height: 575,
    overflow: 'auto',
    width: '100%'
  },
  inline: {
    display: 'inline',
  },
}));

export default function ChatHistoryList(props) {
  const classes = useStyles();
  const chats = [{
      _id: 1,
      name: "Ramandika Pranamulia",
      date: Date.now(),
      message: "Mau kemana bro?"
  },{
      _id: 2,
      name: "Jais Anas",
      date: Date.now(),
      message: "Kapan klassiq IPO nih!!!"
  },{
      _id: 3,
      name: "Arjun Suputra",
      date: Date.now(),
      message: "Gw pengen kawin nih cepet dong....."
  },{
      _id: 4,
      name: "Muhammad Yafi",
      date: Date.now(),
      message: "Gw join lah cuk ,capek jualan sayur"
  },{
      _id: 5,
      name: "Albert The Ace",
      date: Date.now(),
      message: "Bro, gimana progress bro? Gw mau thesis dulu ya..."
  },{
      _id: 6,
      name: "Rais",
      date: Date.now(),
      message: "Mas, target kita minggu ini apa aja?"
  },

  {

     _id: 7,
      name: "F Rouf",
      date: Date.now(),
      message: "Mas, Hello World"

  },

  {

     _id: 8,
      name: "Risa ",
      date: Date.now(),
      message: "Mas, Hello Indonesia"

  },

  {   

     _id: 8,
      name: "Naif ",
      date: Date.now(),
      message: "Mas, Hello Semua"

  },

  {
    _id: 9,
    name: "silver",
    date: Date.now,
    message: "hello Semua baik"
  }
  ]

  return (
    <List className={classes.List}>
    {chats.map(e => (
        <React.Fragment>
            <ListItem style={{padding:0, margin: 0}} onClick={() => props.openChat(e)} >
              <ChatHistoryItem {...e} />
            </ListItem>
          <Divider />
        </React.Fragment>
    ))}
    </List>
  );
}