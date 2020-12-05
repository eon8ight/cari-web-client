import React from 'react';
import { Helmet } from 'react-helmet';

import parse from 'html-react-parser';

import alexCircle from '../assets/images/alex_circle.jpg';
import chanCircle from '../assets/images/chan_circle.jpg';
import cindyCircle from '../assets/images/cindy_circle.png';
import evanCircle from '../assets/images/evan_circle.png';
import froyoCircle from '../assets/images/froyo_circle.png';
import jackCircle from '../assets/images/jack_circle.png';
import maxCircle from '../assets/images/max_circle.jpg';
import zoviCircle from '../assets/images/zovi_circle.jpg';

import styles from './styles/Team.module.scss';

const TEAM_DATA = [
  {
    avatar: froyoCircle,
    title: 'Froyo Tam - Lead Director / Transdisciplinary Design',
    bio: `
Froyo Tam is a transmedia artist and curator, working across many disciplines in design, animation,
and photography. She runs Y2K Aesthetic Institute's Twitter, Instagram, and Tumblr along with Evan.
Froyo also
runs <a href="http://digicam.love" target="_blank noopener noreferrer">digicam.love</a> with
Sofi Lee + Bao Ngo, curating digital photography on point-and-shoots, and is an active member of
Arte Et Labore, a design collective run by Mark Robinson. Froyo is a graduate of Art Center College
of Design in Pasadena, California with a BFA in graphic design. She is the finalist of the 2016
Adobe Design Achievement Awards in Social Impact. Her website can be found
at: <a href="http://froyotam.info" target="_blank noopener noreferrer">froyotam.info</a>.
`.trim(),
  },
  {
    avatar: cindyCircle,
    title: 'Cindy Hernandez - Lead Curator / Design Historian',
    bio: `
Cindy Hernandez is a design historian and writer based in New York City. Her focus is on
speculative and futuristic design ranging from the 20th century to today, with an affinity for the
material culture space age, theme parks, and fast food chains. Cindy is a Master's candidate in
History of Design and Curatorial Studies at Parsons, The New School/Cooper Hewitt, Smithsonian
Design Museum, where she was also the 2017-2018 Curatorial Fellow in Textiles.
`.trim(),
  },
  {
    avatar: evanCircle,
    title: 'Evan Collins - Lead Curator / Architecture',
    bio: `
Evan Collins is an architect and design archivist based in Hollywood, California. His early
research into the 'Y2K Aesthetic' beginning in 2014 helped to lay the foundation for the many
branching eras studied by CARI; he brings expertise particularly in the fields of graphic,
industrial, and interior design of the 1990s. He holds a Bachelors in Architecture from Cal Poly
San Luis Obispo and a Masters in Architecture from Columbia University.
`.trim(),
  },
  {
    avatar: maxCircle,
    title: 'Max Krieger - Assistant Curator / Interactive Media',
    bio: `
Max Krieger is an independent video game developer based in Cleveland, Ohio, who has been involved
with the CARI project since late 2017. With experience in VR, AR, and traditional video game
development, Max has focused on revisiting design conventions of both game mechanics and UI,
approaching them from experimental perspectives informed and inspired by various aesthetics under
CARI's umbrella of study. Presently, Max is working on CROSSNIQ+, a y2k-inspired arcade puzzle
game coming to Nintendo Switch and computer platforms in 2019.
`.trim(),
  },
  {
    avatar: zoviCircle,
    title: 'Zovi McEntee - Webmaster / Project Manager',
    bio: `
Zovi McEntee is an experimental musician, writer, graphic designer, InDesign specialist, and
web/JavaScript developer from the New York City area. She holds a Bachelors of Science in
Electronic Media, Arts, and Communication from Rensselaer Polytechnic Institute. She has been
involved with the CARI project since 2016.
`.trim(),
  },
  {
    avatar: alexCircle,
    title: 'Alex Edwards - Community Organizer / Curator',
    bio: `
Alex is a designer, video artist and photographer who lives in Sheffield, UK. They are a graduate
of Sheffield Hallam University, with a Bachelors in Photography. They have been involved with CARI
since mid 2018.
`.trim(),
  },
  {
    avatar: jackCircle,
    title: 'Jack Grimes - Designer / Curator',
    bio: `
Jack Grimes is a graphic designer and researcher currently based in North Carolina who's worked for
clients from DESKPOP to Warner Music. With a focus on exploring narrative and object by blending
physical and digital media, Jack's work calls on influences and processes from a wide range of
subcultures and aesthetic movements. Jack is currently pursuing a BFA in graphic design at
Appalachian State University. His portfolio can be found
at <a href="https://www.jackapedia.design/" target="_blank noopener noreferrer">jackapedia.design</a>.
`.trim(),
  },
  {
    avatar: chanCircle,
    title: 'Chan Miller - Web Developer',
    bio: `
Chan Miller is a software engineer and musician based in Atlanta, Georgia. He holds a Bachelor of
Science in Computer Science from the Georgia Institute of Technology. When not writing code, Chan
plays drums for an indie band
called <a href="https://open.spotify.com/artist/4wlyzfgVJHCbF3LXiQAjCm" target="_blank noopener noreferrer">Dinner Time</a>.
He has been involved with the CARI project since 2020.
`.trim()
  },
]

const Team = props => {
  const teamDataElem = TEAM_DATA.map(teamMember => (
    <article class={styles.teamArticle}>
      <img alt="Consumer Aesthetics Research Institute"
        src={teamMember.avatar} width="85" />
      <div>
        <h3>{teamMember.title}</h3>
        <p>{parse(teamMember.bio)}</p>
      </div>
    </article>
  ));

  return (
    <>
      <Helmet>
        <title>CARI | Team</title>
      </Helmet>
      <h1 className={styles.teamLabel}>our team</h1>
      <section className={styles.teamContainer}>
        <div>{teamDataElem}</div>
      </section>
    </>
  );
};

export default Team;