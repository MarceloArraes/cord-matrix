import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React,{useEffect} from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMTIxMCwiZXhwIjoxOTU4ODg3MjEwfQ.5n5v1Ns5cr_w6g16S260ZaB2_OFbI22ZgZq7-XfOlak';
const SUPABASE_URL =  'https://kapjhvjdbaxlvwkmkmwe.supabase.co';
const supabase_client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage() {
    const roteamento = useRouter();
    const [message, setMessage] = React.useState('');
    const username = roteamento.query.username;
    const [messages, setMessages] = React.useState([]);
    
    function updateMessagesRealTime() {
        return supabase_client.from('mensagens').on('INSERT',(data) => {
            console.log('mensagem inserida');
            setMessages((messages) => [...messages, data.new]);
        })
        .subscribe();
    }

    //const username = PaginaInicial.getUsername();

    //use getUsername to get the username from the function


    function deleteMessage(MessageToDelete) {
        /* setMessages(newMessages); */
        supabase_client
        .from('mensagens')
        .delete()
        .match({ id: MessageToDelete.id })
        .then((result) => {
            console.log('Message deleted:', result);
            setMessages(messages.filter(m => m.id !== MessageToDelete.id));
        })
    }
    
    useEffect(() => {
        supabase_client
        .from('mensagens').select('*')
        .then(result => {
            console.log(result);
            setMessages(result.data);
        });
        
        updateMessagesRealTime();
        }, []);
    
    function handleMessageInput(e){
        const mensagem ={
            /* id: Math.random(),  */
            texto: message, 
            de: username 
       }
       if (e.key === 'Enter') {
           e.preventDefault();
       }
       if (e.key === 'Enter' && message.trim().length  > 0) {
           supabase_client
           .from('mensagens').insert(
               [mensagem])
           .then(result => {
               console.log(result);
               //setMessages([...messages, result.data[0]]);
           });

           console.log('entered e.key', e.key);
           setMessage('');
       } 
    }

    function handleSticker(sticker_url){
        console.log('sticker_url', sticker_url);
        const mensagem ={
            de: username,
            texto: `:sticker:${sticker_url}`
        }
        supabase_client
        .from('mensagens').insert(
            [mensagem])
        .then(result => {
            console.log(result);
            //setMessages([...messages, result.data[0]]);
        })
        .then((data) => {
            console.log('data', data);
        });
        setMessage('');


    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={messages} deleteMessage={deleteMessage} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                    
                        <TextField
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                            value={message}

                            onKeyPress={(e) => {
                                handleMessageInput(e);
                            }
                          }
                            onChange={(e) => {
                            setMessage(e.target.value);
                            }
                            }
                        />
                        <ButtonSendSticker onStickerClick={handleSticker} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    if(props.mensagens.length === 0) {
        return <div></div>}

    //map the props.mensagens to a list of messages
     const messages = props.mensagens.slice(0).reverse().map((mensagem) => {
        return ( 
            <Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >   
                <Box
                    styleSheet={{
                        marginBottom: '8px',
                    }}
                > 
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                    />
                    <Text tag="strong">
                        {mensagem.de}
                    </Text>
                    <Icon
                    className="deletemessage"
                    label="Icon Component"
                    name="FaRegWindowClose"
                    styleSheet={{
                      color: 'currentColor',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      float: 'right',
                    }}
                    onClick={() => {
                        console.log('clicked');
                        //use function changeMessages to remove the message from the list
                        /* props.deleteMessage(props.mensagens.filter(m => m.id !== mensagem.id)); */
                        props.deleteMessage(mensagem);
                    }}
                  /> 
                    <Text
                        styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                {mensagem.texto.startsWith(':sticker:') ? 
                <Image src={mensagem.texto.replace(':sticker:','')}  /> : 
                mensagem.texto
                }

            </Text>
        )})
    return (
      <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
        {messages}
        </Box>
    )
  } 
