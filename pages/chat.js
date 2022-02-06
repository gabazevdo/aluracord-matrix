import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

/* Icones - React-icons */
import { FaRegTrashAlt, FaTelegramPlane } from "react-icons/fa";

const trash = <FaRegTrashAlt />;
const send = <FaTelegramPlane />;

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0Mzc1NjczOCwiZXhwIjoxOTU5MzMyNzM4fQ.3e0_ujE8GP0dDFNWi195-pvxPZEd0whJB1Xr4wpgUzc";
const SUPABASE_URL = "https://dvkzpxfegymfqcnbctyt.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function mensagemEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (reponse) => {
      adicionaMensagem(reponse.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
  const root = useRouter();
  const userLogado = root.query.username;

  React.useEffect(() => {
    const dadosSupabase = supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    mensagemEmTempoReal((novaMensagem) => {
      setListaDeMensagens((valorAtualDaLista) => {
        return [novaMensagem, ...valorAtualDaLista];
      });
    });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: userLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {});
    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              key={mensagem.id}
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            {/* Botão stickes */}
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(":sticker: " + sticker);
              }}
            />
            {/* Botão enviar */}
            <Button
              styleSheet={{
                backgroundColor: "transparent",
                margin: "10 10px",
                marginBottom:'8px',
                filter: "grayscale(1)",
                
                hover: {
                  filter: "grayscale(0)",
                  backgroundColor: "transparent",
                  color: appConfig.theme.colors.neutrals[800],
                },
              }}
              onClick={() => {
                handleNovaMensagem(mensagem);
              }}
              label="📨"
            >
              Olá
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  // Para deletar a mensagem
  const delMensagem = (delMensagem) => {
    alert("Falta implementar - id: " + delMensagem);
  };

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Box
            styleSheet={{
              display: "flex",
              justifyContent: "space-between",
              width: "99%",
              marginBottom: "12px",
            }}
          >
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: "5px 0 0 5px",
                padding: "6px",
                backgroundColor: appConfig.theme.colors.neutrals[500],
                width: "100%",
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                },
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                <Image
                  styleSheet={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">{mensagem.de}</Text>

                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>
              {mensagem.texto.startsWith(":sticker:") ? (
                <Image
                  styleSheet={{
                    maxWidth: "200px",
                    minHeight: "200px",
                  }}
                  src={mensagem.texto.replace(":sticker:", "")}
                />
              ) : (
                mensagem.texto
              )}
            </Text>
            {/*Botao para deletar*/}
            <Box
              styleSheet={{
                display: "flex",
              }}
            >
              <Button
                key={mensagem.id}
                onClick={() => delMensagem(mensagem.id)}
                label={trash}
                styleSheet={{
                  borderRadius: "0 5px 5px 0",
                  backgroundColor: "#9E2A2B",
                  select: {
                    backgroundColor: "#FFF",
                  },

                  hover: {
                    backgroundColor: "#B12F31",
                  },
                }}
              ></Button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
