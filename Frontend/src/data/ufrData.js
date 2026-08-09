export const UFR_DATA = {
  "UFR SET": {
    "Informatique": {
      "Informatique": ["L1", "L2", "M1"],
      "Genie Logiciel": ["L3", "M2"],
      "Reseaux et Telecommunications": ["L3", "M2"],
    },
    "Physique Chimie": {
      "PC": ["L1", "L2", "L3", "M1"],
      "Physique": ["M2"],
      "Chimie": ["M2"],
    },
    "Hydro-Sciences et Environnement": {
      "LSEE": ["L1", "L2", "L3"],
      "Gestion de l eau": ["L3"],
      "Ingenierie et Gestion de l Environnement": ["M1", "M2"],
    },
    "Mathematique Informatique": {
      "MI": ["L1", "L2", "L3"],
      "Mathematiques pour l enseignement": ["L1", "L2", "L3", "M1", "M2"],
      "Mathematiques et applications": ["M1", "M2"],
      "MSDA": ["M1", "M2"],
    },
  },
  "UFR SES": {
    "Management des organisations": {
      "MIO": ["L1", "L2", "L3"],
      "MTH": ["L1", "L2", "L3"],
      "MATC": ["M1", "M2"],
      "MSDA": ["M1", "M2"],
    },
    "Sciences Economique et de Gestion": {
      "SEG": ["L1", "L2"],
      "TBQ": ["L3"],
      "GEP": ["L3"],
      "BFA": ["M1", "M2"],
    },
    "Langues, Lettres et Sciences Humaines": {
      "LAC": ["L1", "L2", "L3"],
      "LEA": ["L1", "L2", "L3"],
    },
  },
  "UFR SI": {
    "Genie Civil": {
      "CPSI": ["L1", "L2"],
      "Genie Civil": ["L3", "M1", "M2"],
      "Geometre-Topographe": ["L3", "M1", "M2"],
      "Architecture": ["M1", "M2"],
    },
    "Geotechnique": {
      "Geotechnique": ["L3", "M1", "M2"],
      "MSG et MT": ["M2"],
    },
    "Genie Geologique, des Mines et de l Eau": {
      "Hydrogeologie": ["L3"],
      "Qualite, Hygiene, Securite et Environnement": ["L1", "L2"],
    },
    "Sciences et Techniques Spatiales": {
      "Geomatique": ["L1", "L2", "M1", "M2"],
    },
  },
  "UFR IUT": {
    "Genie Civil": {
      "BTP": ["L1", "L2"],
      "GT": ["L3", "DUT1", "DUT2"],
      "GLT": ["DUT1", "DUT2"],
    },
    "Genie Electrique Informatique Industrielle": {
      "Genie Electrique Informatique Industrielle": ["L1", "L2"],
    },
    "Genie Tertiaire": {
      "GACT": ["DUT1"],
    },
  },
  "UFR SANTE": {
    "Espace des programmes de licence": {
      "Optique Lunetterie": ["L1", "L2", "L3"],
      "Orthoptie": ["L1", "L2", "L3"],
      "Soins Infirmiers et Obstetricaux": ["L1", "L2", "L3"],
    },
    "Espace des programmes de master": {
      "Sciences Biologiques et Exploration Fonctionnelle": ["M1", "M2"],
      "Sexologie Clinique": ["M1", "M2"],
    },
  },
}

export const UFR_LIST = Object.keys(UFR_DATA)

export function getDepartements(ufr) {
  if (!ufr || !UFR_DATA[ufr]) return []
  return Object.keys(UFR_DATA[ufr])
}

export function getFilieres(ufr, departement) {
  if (!ufr || !departement || !UFR_DATA[ufr]?.[departement]) return []
  return Object.keys(UFR_DATA[ufr][departement])
}

export function getNiveaux(ufr, departement, filiere) {
  if (!ufr || !departement || !filiere) return []
  return UFR_DATA[ufr]?.[departement]?.[filiere] || []
}
