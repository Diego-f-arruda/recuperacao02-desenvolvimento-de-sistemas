'use client'

import { Dev } from "@/types/Dev";
import { FormEvent, useEffect, useState } from "react";
import axios from 'axios'
import styles from './styles.module.css'


const API_URL = "http://localhost:3333/devs";

export default function Page() {
  const [dev, setDev] = useState<Dev[]>([]);
  const [nome, setNome] = useState<string>("")
  const [tech, setTech] = useState<string>("")
  const [perfil, setPerfil] = useState<string>("")
  const [bio, setBio] = useState<string>("")
  const [avatar, setAvatar] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    loadDevs();
  }, [])


  async function loadDevs() {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem('access_token')

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setDev(response.data);
    } catch (error) {
      console.error('Erro ao carregar as Informações:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDev(event: FormEvent) {
    event.preventDefault();

    const storedToken = localStorage.getItem("access_token")

    if (!nome.trim() || !bio.trim() || !tech.trim() || !perfil.trim()) {
      alert("Por favor, preencha nome e biografia.");
      return;
    }

    const devData = {
      nome,
      tech,
      bio,
      perfil
    };

    try {
      setIsLoading(true)
      let response;
      if (dev) {
        response = await fetch(`${API_URL}/${dev.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
          body: {
            nome,
            tech,
            bio,
            perfil
          },
          body: JSON.stringify({ ...dev, ...devData }),
        });
      } else {

      }
      response = await fetch(API_URL, {
        method: "POST",
        body: {
          nome,
          tech,
          perfil,
          bio
        },
        body: JSON.stringify(devData)
      })
    } catch (error) {
      const errorData = await response.json();
      throw new Error(dev ? `Erro ao atualizar dev: ${errorData.message || response.status}` : `Erro ao criar dev: ${errorData.message || response.status}`);
    }


    setNome("");
    setTech("");
    setBio("");
    setPerfil("");
    setIsLoading(false)
  }

  async function handleDeleteDev(id: string) {
    // FAZ CHAMADA DO TIPO DELETE A API (JSON-SERVER)
    // CHAMA O LOADDEVS PARA ATUALIZAR OS DEVS
  }

  function handleEditDev(dev: Dev) {
    setDev(dev)
    setNome: (dev.nome);
    setTech: (dev.tech);
    setBio: (dev.bio);
    setPerfil: (dev.perfil)

  }
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <div className={styles.formulario}>Formulario</div>

        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
        <input type="text" id="tecnologias" value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Tecnologias" />
        <input type="text" id="perfil" value={perfil} onChange={(e) => setPerfil(e.target.value)} placeholder="Perfil" />
        <input type="text" id="biografia" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Biografia" />
        <button type="button" onClick={() => {
            
            setNome("");
            setTech("");
            setBio("");
            setPerfil("");
          }}
      </div>

      <div className={styles.cards}>

      </div>
    </div>
  );

}