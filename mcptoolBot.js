const mineflayer = require("mineflayer");
const mccolors = require("minecraft-colors");
const socks = require("socks").SocksClient;
const readline = require("readline");
const path = require("path");
const fs = require("fs");
const os = require("os");
const mc = require("minecraft-protocol");

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.on("uncaughtException", (error) => {});
process.on("unhandledRejection", (reason, promise) => {});

/**
 * Method to get the path of the MCPTool folder
 * and create it if it doesn't exist
 *
 * @returns {string} Path of the MCPTool folder
 */
function getMcptoolPath() {
  let mcptool_path;

  if (process.platform === "win32") {
    mcptool_path = path.join(os.homedir(), "AppData", "Roaming", "MCPToolData");
  } else {
    mcptool_path = path.join(os.homedir(), ".config", "MCPToolData");
  }

  try {
    fs.accessSync(mcptool_path);
  } catch (error) {
    fs.mkdirSync(mcptool_path, { recursive: true });
  }
  return mcptool_path;
}

/*
 * Get the text from a JSON object
 * @param {string} json JSON object
 * @returns {string} Text from the JSON object
 */
function getTextFromJSON(json) {
  let obj = null;

  try {
    obj = JSON.parse(json);
  } catch (_) {
    return null;
  }

  let text = "";

  function processExtra(extra) {
    if (Array.isArray(extra)) {
      extra.forEach((item) => {
        if (item.text) {
          text += item.text;
        }

        if (item.translate) {
          text += item.translate;
        }

        if (item.extra) {
          processExtra(item.extra);
        }

        if (item.hasOwnProperty("with")) {
          text += getTextFromJSON(JSON.stringify(item.with));
        }
      });
    } else if (extra.text) {
      text = extra.text;
    } else if (extra.translate) {
      text = extra.translate;
    }
  }

  if (Array.isArray(obj.extra)) {
    processExtra(obj.extra);
  } else if (obj.text) {
    text = obj.text;
  } else if (obj.translate) {
    text = obj.translate;
  }

  return text.trim();
}

const RANDOM_USERNAMES = [
  "hzlounch",
  "mathias699",
  "wazaelpepe",
  "itzpandaq",
  "matimaster006",
  "quemeganuub",
  "javier912",
  "ajente117",
  "porroausjxd",
  "llopjr",
  "dajir",
  "emnma",
  "eliel34",
  "juandiego",
  "1vs1cristal",
  "jeff_kill_33",
  "intrusoliterario",
  "tade123xd",
  "night_elemental",
  "massi334455",
  "vichop11",
  "kznzk",
  "stumblegeys",
  "josedmc_uwu",
  "elmataviejitos",
  "zjuanangel17",
  "ezequiel3000",
  "cris5050",
  "milanesa0806",
  "zvisk",
  "lazarin2",
  "malusalomon",
  "tiktokandrew",
  "gamerita77",
  "hola364",
  "kelwendk",
  "tutu1010",
  "alyto",
  "deadsoul",
  "leyerxdhd",
  "theryzss",
  "eduarddoox",
  "legendsxx",
  "lucas340",
  "stevengamer4",
  "btwswyrr",
  "tutilin222",
  "alex_pro67",
  "reymomos",
  "cris123pro12",
  "gonzalo1020",
  "familia123",
  "manolo333190",
  "rettach",
  "uwu123",
  "el_pato_mas_pro",
  "fabian_375",
  "dimas",
  "chifasito",
  "megaslewisyt",
  "rodrixddxdxd",
  "edsonnl11",
  "ed3w2rd",
  "fhakiee",
  "batatasgg2121",
  "mandril110",
  "guillelo123",
  "tody_mvp",
  "pablolapapa143",
  "dylan0iq",
  "nicejam",
  "12ertyu",
  "insulza88",
  "oulio23",
  "bau777_",
  "v1xhut",
  "alexmihai",
  "ikkixd_",
  "bornoxowo",
  "bautista_1234pvp",
  "dante_hcfgood",
  "cristoferelpro",
  "mauri1734",
  "ronald",
  "cabetioxd",
  "tymines",
  "danjog",
  "zfaxx",
  "minikatzemaru",
  "felixwaza",
  "estephano123456",
  "fitoxdb",
  "ismael503sv",
  "dragon12ballpepe",
  "blindingmite952",
  "tomistrong",
  "elmasinsano1234",
  "jerovasu27",
  "m471r08",
  "itzchuty_",
  "rikcylimon",
  "valentingamer",
  "raphael140901",
  "sammuel1425",
  "joelinsano",
  "runvoski",
  "adawsd",
  "sebas4518",
  "mariowil13xd00",
  "momasos_tio",
  "andrespt1",
  "exilio2424",
  "alej0pp",
  "xd3456781",
  "sr_pvp_god",
  "wejfq123456",
  "alexqlom",
  "quepedosxd",
  "zam123",
  "elchanti105",
  "1v1cristian",
  "dest09",
  "anfe4561",
  "soykl",
  "zwasin_",
  "fgeeegd",
  "movviipp",
  "wazin2023",
  "aalalolo",
  "angelexperies12",
  "ismaelroger",
  "sip123",
  "soysasukexd13",
  "bobicrat123",
  "mellamantustin",
  "alexbzn09",
  "dgamer24",
  "discoleader4700",
  "lean1010",
  "axel1012",
  "omarmc2020",
  "daison_pvp__",
  "flankaka",
  "jfewdb",
  "colachon321",
  "ttponkytt",
  "bauu17",
  "xxjeannxx",
  "lrip_dex11",
  "leandro_tv",
  "orlandocapo3",
  "soyivano2",
  "spidercerdo2024",
  "peduretis",
  "joemax33",
  "jericucu14",
  "martinmartineezz",
  "slimhaddock",
  "rozaasproxd",
  "maciasjose",
  "santiago321456",
  "martinexggyt",
  "swagg17",
  "justin356_xd",
  "gabriel002288",
  "alexisus12",
  "chemsfino",
  "p0ti_",
  "srmathiasxnx",
  "mashucoe",
  "jose200",
  "shaina",
  "mauriciobayronxd",
  "bcont46",
  "gechuxz2012",
  "deditomikuko",
  "santiwin17",
  "dyng91",
  "tionacho1231",
  "marrufo",
  "sneeringthread6",
  "simpdenot_perfil",
  "thiagovillalba2",
  "valentino159",
  "cyrus",
  "eduarklk",
  "luisgsy",
  "valentino147",
  "mrribon",
  "jhoncofee",
  "camilodmc",
  "juaneki",
  "alesandro873",
  "zeus2021lop",
  "qiirsiurjsf",
  "sprendmc",
  "adrian1345",
  "thedog2248",
  "elcacas124",
  "jarmay",
  "yarte2000",
  "thewatched",
  "tiexai000",
  "juguix11",
  "zsxebax",
  "lolo2123",
  "crepeer",
  "thewarchet",
  "dextra2308",
  "josueprrr",
  "alonso032218",
  "emilio1729",
  "stat_raptor",
  "droidomegafast",
  "thesebas555",
  "rubal21",
  "outlaw",
  "isimonyuti",
  "mathias9624",
  "lautarokay",
  "dereckamy",
  "papafritaboyxd",
  "fedexxx35",
  "leoncio",
  "wizardabiniz",
  "facundoluffy",
  "miguelph17",
  "arcangel_80xd",
  "sucosiu1234siu",
  "thejuan777u8_",
  "ezeg4mer2",
  "thiago13",
  "invictorgs3",
  "novita_of",
  "oscartutioytxdd",
  "panditadmc1",
  "maxrx",
  "magodefuria",
  "chistoprpg",
  "pikachu",
  "proym_2006",
  "ismaelxdd099",
  "nul3s77",
  "jh_777",
  "osmiex",
  "tolima1214",
  "ricardo_3021",
  "rwfsdfs",
  "plasdes",
  "amadeo123",
  "aoyaaaa",
  "fernanxd033",
  "sprrreasen",
  "futbol2229",
  "cawechitooo",
  "raulkvan",
  "xxnyzbv",
  "twitchglowspeed",
  "estevenelproxd",
  "vitrongamer",
  "the_juanix",
  "dgtuti",
  "jhonatan1070",
  "benjax321",
  "zdarkoff_",
  "facufett",
  "crixv0",
  "dealnote123gg74",
  "brandon_ytproo",
  "benjaxdgod",
  "ulicraftmc",
  "jarkgam3ryt",
  "ignvcioo",
  "lassito_xxx",
  "gonixas",
  "bran_z",
  "dumah_xd_",
  "shadown_jh",
  "elquique_13",
  "spxszy",
  "pruebas_no",
  "666shadowne666",
  "00_player_00",
  "ownerjoel",
  "leonelmei45",
  "spreengod",
  "capkelot",
  "bartolo_mc",
  "juanito091211",
  "itz_dracopvp",
  "elguajiro",
  "tamalito9840",
  "walt3rcraft",
  "toruyt",
  "oscar_1212",
  "zuis6",
  "maty_hi",
  "luismx",
  "mateitocap132",
  "jorge2080",
  "delux_withe",
  "kydork12",
  "leodoy123",
  "panterammg",
  "katakurigod999",
  "elmanquito360",
  "erickxxxtlv",
  "deian2028",
  "elcris45",
  "jupipob",
  "gatoferoz27",
  "chahahhah",
  "meliodapi",
  "zjoaco14k",
  "pateurban",
  "onichan1023",
  "quattro_pedro",
  "quattro",
  "zpeltx",
  "vicho54",
  "zzzzzzz",
  "sr_minero_dmc",
  "elpro_pvp_0_0",
  "bat_hero_stilez",
  "_pelusita12",
  "max_1",
  "muak_xd",
  "criszap777",
  "cerrilol",
  "haloop906",
  "alvea_pvp_0_0",
  "ztwxy",
  "shinseid",
  "03_zenitsu_16",
  "jotapna",
  "bugaxz",
  "sebastfx",
  "xxdeviesxx",
  "coke7171",
  "pipehd4k",
  "xqde_",
  "ale_wxo",
  "mathiuselcapo1",
  "maribb",
  "dennys1n",
  "samirac",
  "dolido64",
  "fenando12",
  "thiago__09z",
  "eliasescat",
  "ale2544",
  "lautisanchez1",
  "magettayt",
  "dizzzidan",
  "thewhiterzzz",
  "jazul",
  "alavaro09",
  "alexander123p",
  "zeon_lagrasa_zzz",
  "sthit",
  "_jesus12_",
  "itz_did_098",
  "iansimioni",
  "juanchitoop",
  "desercraft57",
  "sese007_yt",
  "joaaco",
  "usmancraft",
  "santiago_ed",
  "junidmc1",
  "p9_99",
  "frutz000888",
  "ben10elmejor",
  "chimpase901020",
  "pdkedifj",
  "xhichamorada5",
  "mart_in_ok",
  "08carlosalexis",
  "navas191919",
  "tupac",
  "salmonozo",
  "faustxxs_83",
  "pat0zkkj",
  "estebony123",
  "dyabalaxdddde",
  "chayanejose",
  "patololo10",
  "laven",
  "pepe102",
  "icon_deoxy",
  "ramsesprox",
  "itomanco",
  "pajarillo",
  "eldiablo87",
  "simonjcvm",
  "hiunzu",
  "demon_77xd",
  "chamoyada5",
  "tizziano912",
  "patocalvo21",
  "pedropt",
  "camiloelpanaxd",
  "rentorno",
  "gero",
  "xxsaeenzxx",
  "wolftt",
  "zblack399",
  "capitoli",
  "darck_slayer",
  "yatosempai",
  "akakuz07",
  "elpro12121",
  "thiago102023",
  "raion593",
  "impariuman",
  "boniefdgamerxd",
  "darielelpro",
  "martinekee",
  "xandta66",
  "yordan1pvpxd",
  "fantinxd",
  "benitocamelo2275",
  "monky_0001",
  "jefermcz",
  "leyniker13",
  "alsrmxd",
  "tiagoga140h",
  "xxwazaa_56xx",
  "happy13",
  "xlukarioxlol",
  "diegooo3000",
  "yajaira223",
  "mathiuselcapo12",
  "isan",
  "mr2lucas",
  "ikertfghiu",
  "luchitoxd54",
  "soyperra12345",
  "thedog",
  "anticristo123",
  "soy_esteban",
  "andreuvvs",
  "soydog",
  "egjvelproxd",
  "crisbruhxdd_1",
  "sosuncapooooo",
  "criss_zx",
  "kxyxzz",
  "anju987",
  "pekkota09",
  "maykel14xxx",
  "preees1",
  "johnny2314441",
  "julio",
  "zacarias555",
  "nick_46",
  "stonyfeather166",
  "pipe_pvp",
  "josesitogood",
  "gamer2325xd",
  "soyju4ni0pro",
  "samu1234567",
  "ferchu77734",
  "coopex",
  "yxxxrgv",
  "el_facha_19",
  "dowsk",
  "nico2223",
  "solomemintio",
  "trueno_zeta",
  "bcdiego",
  "jdherrero",
  "santiago2010",
  "searwolf",
  "eduardoyt1k",
  "tomate9244",
  "elmilton1234",
  "elweon00",
  "truenogamer13",
  "lucho_1309",
  "tuchicraft",
  "xxraptorrxx",
  "manaco_polaco",
  "proyix",
  "x_hans_",
  "kilopato098",
  "neyseryt",
  "v8ch0",
  "yovanaguerrero1",
  "alexander1245hy",
  "the____bicho",
  "davis223",
  "leandro31",
  "paz_motor",
  "alancrockar12",
  "juanes2319",
  "soyjuan2",
  "uziel285",
  "itzlocked",
  "ella",
  "elmo_offc",
  "snxfox4",
  "agusfmc",
  "hegh",
  "diego29gamer",
  "juandiegopro",
  "criscaneo00",
  "diskseb_",
  "hilosconcheems",
  "fernando2020xd",
  "franco667",
  "nahuok",
  "kakaroto9",
  "itr3xh",
  "shy_yoshi",
  "clingingbroom",
  "nicojkjk151",
  "_mxxlzz",
  "teddyoso2",
  "brianvega90",
  "tokals_copa",
  "almasdmc",
  "edu15f",
  "frankil_zzz",
  "huevitoxdwe1",
  "mmagickeiiboy",
  "plataxxx",
  "azuqy",
  "flama68",
  "eleonary",
  "juniors1800",
  "opsyo",
  "eduardo18_18",
  "elotakupro60",
  "tamiiarg",
  "gomita7012",
  "eli2010_",
  "elmata_nub",
  "tonzakky",
  "lionel1248",
  "bp_alieen",
  "dinorex5",
  "jinjooxd",
  "jorchhhhhh",
  "zeusrompecraneos",
  "notmora",
  "worjuanchi",
  "brayan20088",
  "tcxlexer",
  "ysnoal",
  "of_darck",
  "cleanbots",
  "pepecrafter231",
  "saxx__13",
  "wwwfft12",
  "nashemod",
  "elpitodulce",
  "kratospe",
  "abop",
  "buff_____boolt",
  "paolotroll",
  "mauri2536",
  "_mexassz",
  "noble",
  "jairop132",
  "marioo_bp2",
  "pande_koko",
  "piero_sad",
  "sabas124",
  "darksita_slayin",
  "venonred",
  "zbautii",
  "kdiego123",
  "sebastixnff",
  "fubelito2009",
  "v1centexxdddd",
  "sargento244",
  "elvis132458",
  "rgb_joaquin",
  "bautu_dmc",
  "xxnoo_byxx",
  "atomicall",
  "rgb_jero",
  "juanf123",
  "dmaxmas",
  "tallofnf",
  "dmaxmas2",
  "fyugeyu",
  "zkarim999",
  "josefo_aa66",
  "d1eg0",
  "angelinxm",
  "jhonaguilar",
  "celusal3",
  "karrotoo54",
  "metalsonic09456",
  "lmkorr",
  "adrianmazna",
  "j0rg3xd",
  "joseeph_dmc",
  "monkler",
  "paltoctm",
  "silla",
  "nando_dmc",
  "alfa",
  "dotor_sexo",
  "ransho",
  "joscopro13",
  "kuriaguilar",
  "elbetosky11",
  "tizi4n023",
  "zmid",
  "sofia32",
  "mellamanlauti",
  "holacuasas",
  "axron7",
  "luis1112",
  "joaquin272154",
  "ratana",
  "kiwwiidiee",
  "lnheith",
  "mamurraso123",
  "carrexspreen",
  "jefrayxd",
  "yadielpegaso300",
  "messi_xd23",
  "juster13u",
  "atembado",
  "goculo321",
  "lucas21092",
  "197311enco",
  "aldairxv",
  "lisa",
  "bankxte",
  "aaronmc12",
  "sebasraz12",
  "tix_ixh",
  "smithbelen23",
  "mariopvp13",
  "elpromesi11",
  "kidzmeow",
  "nyq5",
  "lucho129",
  "fazie_",
  "milejo397500",
  "tanfela3",
  "quegay",
  "zchanguitos_",
  "alexis7rrrr",
  "_luna_20",
  "fabi_lr",
  "karshei",
  "zpanochita",
  "capitancapybara",
  "mr_nic0sxd",
  "cucaracha1409",
  "tordes_pvp",
  "hyperclik",
  "kathemg11",
  "luiserfi",
  "byantuxz5",
  "solomeopares10",
  "kmzekett",
  "urifol_32",
  "saigokun",
  "memonstro",
  "leandrofachero",
  "josue12309",
  "andheruwu",
  "adrzxxzz",
  "kirito_gamer53",
  "ilaquesopo12",
  "lioxem",
  "stevenfg2",
  "___blizz___",
  "rxdrake",
  "elbichosiuu",
  "piero472k",
  "brian198211",
  "seth_rp",
  "daniel16",
  "alegando0132",
  "thebadtigre",
  "pinpollo7638",
  "negativethiago_",
  "tilinthrd0802",
  "lauty_05",
  "pandaxd",
  "nicolasxd28112",
  "pancho_09",
  "someonxuknxwn",
  "juaquinxdlol",
  "tuamasepone",
  "elpeep",
  "matiasazz",
  "toxic_sebas",
  "zzmortalzd",
  "escalante_503",
  "lionelmc",
  "princeplays109",
  "luisfre12k1",
  "elyafrin",
  "tizinuv",
  "faze_viktor",
  "lpkzz",
  "dream",
  "lucerga21",
  "mistergame99",
  "juniorcastro",
  "martinezcvx",
  "kakoide",
  "zenitsubv",
  "yomama69guy",
  "nacho123xd",
  "thegreft",
  "hamid008",
  "naruto_100259",
  "alwsito",
  "urielmp",
  "leo",
  "itz_nxxcho",
  "_lyhourboysmos",
  "th_alechito",
  "gagora3478",
  "xd13",
  "nekro",
  "darguin",
  "cris8580",
  "pogo_42",
  "aral3792",
  "causa1342",
  "pidemediolungo",
  "cesar4ikee",
  "terranator2000",
  "angelito252627",
  "andresna",
  "tulasa",
  "pikabubushido",
  "cuevagames",
  "zeptorbz",
  "matveinepvp1",
  "lauri_005",
  "bp_destrucor32",
  "countersotriker2",
  "david2732",
  "holaaa11",
  "vtmalin",
  "nytoak31",
  "sankboy",
  "juaninmortal",
  "paco009",
  "stone_fow",
  "hentari",
  "darkking1q",
  "marco_23",
  "ferser20",
  "jeampro170",
  "jugadormaximoche",
  "brxx7by",
  "akatsuki_4itor",
  "lucascapo9",
  "vasco00",
  "misorx",
  "dertikumonu",
  "carlos25gmna",
  "elgrande32",
  "albertocatetas2",
  "labebesita2561",
  "seafrenzs23",
  "elmiki97vv",
  "bixgt",
  "pure_ory",
  "el_dagixd",
  "luistomex",
  "akaliter",
  "eldiablo_fgd",
  "avionuub",
  "tulipanagresivo",
  "bestoperuvian",
  "angel778",
  "isyagami",
  "kanceepts",
  "ivansito",
  "thevimix1",
  "jjorbbens1",
  "nochesxdxd",
  "65767",
  "naxlito101",
  "sebas1t516171819",
  "glamkyo",
  "san123",
  "gato2o0",
  "insaerzzz",
  "saltoff_mc",
  "yeruios",
  "lolwasawasa",
  "bp_aliien12",
  "botas123",
  "chicotealfa",
  "flow69",
  "angelalejandro",
  "nd_kobi",
  "ddxwusre123",
  "bp_maincra",
  "cazafantasma",
  "roket_lege",
  "eitu",
  "cazafantasmas",
  "jose_pvpv_pract",
  "_zxasdxz_",
  "agustinsafaryn",
  "yosoyhackxd",
  "besper",
  "adri732",
  "dropeado_",
  "dropeado__",
  "tilin_te_odia",
  "grxxxxx",
  "procito9900",
  "simon_siuuuu",
  "mr_estebanxd180",
  "juanagaymer",
  "kiti_lol",
  "princezhairus",
  "pitin",
  "meyed_",
  "edilmar",
  "cryuft",
  "aagorena",
  "guelo",
  "youngkavper",
  "synx_szymikx",
  "skrysh",
  "soyvladt",
  "zmemoxxz",
  "machete360",
  "jss_u",
  "baba_gril",
  "stoki20",
  "juakinchico",
  "edugr08",
  "laga322953",
  "narticho676",
  "mateopro55",
  "yerardgamer",
  "ninjaxxlebg",
  "adrian454145",
  "witfy",
  "bryanfcb",
  "aroxlu",
  "mxrtingd",
  "julianmdww",
  "jotafor",
  "yosoysimon",
  "tross_122",
  "notramix",
  "neriyos1123",
  "jair14_4",
  "bryanpe",
  "snoofdemon2",
  "fabo1304",
  "enrique2341",
  "rx_rodrix",
  "anderson_",
  "santiagolezca",
  "xthe_dragonx",
  "gaolucha",
  "goreoldz",
  "sebastianxd3011",
  "ivan123",
  "adrianfxo41yt",
  "alex_tr1234",
  "ovegdeyku",
  "joseft00",
  "vendomariwana",
  "liviano_norte",
  "miniinsanowazaa",
  "gjfud",
  "usuarionormal",
  "juansexd111",
  "mellamosebas",
  "rober1505",
  "edgarso2009",
  "fazenaruto45",
  "tlfknicolas",
  "peruanokcheroxd",
  "velodyfax",
  "tu_buenito",
  "dexpro321",
  "zperuanito_",
  "bozkz",
  "dinky29",
  "patitafrita_1",
  "oruigon_pro",
  "rzgr5184",
  "otropvp",
  "redetroylol",
  "pandaro110yt",
  "tigreb",
  "master_crack361",
  "kelamelratonyt",
  "samukrik",
  "chirfield",
  "renzohr24",
  "itz_draxx",
  "ari12345",
  "asiakticdmc16",
  "juanyt32",
  "crack_13",
  "duduska",
  "ghostfacewaza",
  "oddymg1234",
  "crist_pvp",
  "gmzz_grc",
  "juanpusey",
  "koyotaro",
  "nexxx67",
  "dryganbatrik",
  "juli2012xd",
  "droppedbyyoung",
  "fedetico12p",
  "azaeliv",
  "bryan2983",
  "kevinxda",
  "yitoman1321",
  "santicomepan",
  "biso24",
  "gigelelan",
  "factsop",
  "alfon4_mtb",
  "viiicw",
  "jesussexoman",
  "quiri10",
  "alberto20097048",
  "el_botsito123",
  "axelin408",
  "maiqui2623",
  "porota2006",
  "vicentexd_el_pro",
  "diegololl",
  "xxluccianoxx",
  "dxvid",
  "luis1957",
  "death_gamer",
  "nacoya123",
  "mozes001",
  "sacredcelery199",
  "kshuli",
  "alexis101",
  "wueb0n21",
  "logasawdaz",
  "willlids",
  "balorex123",
  "ijulianx",
  "ferni_xdd",
  "aceptrules",
  "xxxmapache16xxx",
  "pepomalaga",
  "scott23909022",
  "elxokazcraf",
  "elcocosupreme",
  "unmanrandomxd",
  "hambur2019",
  "jr_funix",
  "itzalexbroder",
  "ellwaza",
  "jeison77",
  "alexauwu911",
  "aaron_dmc",
  "tatan5590",
  "angel7050",
  "crispetitas234",
  "fauti10dvd",
  "cedricproxd",
  "papitafrita2",
  "yumieeeee",
  "capy1020",
  "serbanrupecapu4",
  "xenxey",
  "sootraibes",
  "zaskesito1",
  "enxvity_mc",
  "m3zut",
  "jhonajuan",
  "prrro444",
  "chichicrack",
  "umutnet",
  "go459",
  "ppsniffer",
  "pan_mayo",
  "ivpdfzzzz",
  "xxpvpcraftxx",
  "alfonsokpo",
  "showspeedxd",
  "codxian",
  "trofi_d4",
  "kratospe19",
  "0xcamilos",
  "cyb3rl0v3",
  "pvplote",
  "lauti2112",
  "xxdavid2007xx",
  "elparrila",
  "whigest",
  "feliolivar78",
  "wman",
  "gameratos2",
  "zatekhola",
  "locaso09212",
  "elmarck",
  "ianvamos333",
  "gustagopremiun",
  "p3cador_",
  "yosise212",
  "faze_divine9608",
  "p3cador__",
  "xkizaki777",
  "bysamirk",
  "thomas_xd_l",
  "_dither_",
  "taxitito1656",
  "josue198347",
  "maskmit",
  "lozts",
  "tahiel209834219",
  "napy4",
  "travisthompson",
  "dasdadasd",
  "johanoob1",
  "nombre_ramdom",
  "s3b2z_431",
  "joaquito332231",
  "killercreeper47",
  "bruno2323",
  "josephcapo",
  "m4x1m0_o",
  "anthony_gamer30",
  "joaquin34567890",
  "gamer_pvp123",
  "samurijikaro_uwu",
  "thp7s",
  "tomi2008",
  "ninimaa4n",
  "mollito54",
  "alex_s",
  "sapp",
  "benjitaa_",
  "buzza_b",
  "pedrobya",
  "lol66482",
  "10ve1y",
  "david333190",
  "juanpax56478",
  "zsepi_",
  "styleofmessi10",
  "ibomboncito_",
  "juan_yt",
  "tugatitatraviesa",
  "saidmachaca",
  "the_rusection",
  "fercarpez21",
  "bp_legandary",
  "sebaxdbd_",
  "exper_angelo25",
  "rikintrolin",
  "fhzs",
  "cheroskyyu",
  "german1212",
  "kikexssj",
  "danteganters676",
  "donmuerte_yt",
  "onnexxx",
  "holasoyuki",
  "casualidades",
  "geskjr",
  "rodrigo2617",
  "ricardoxdpro505",
  "mxto15",
  "sealtactico",
  "alveiro1925",
  "seasnail4235",
  "bp_truers",
  "romerito",
  "cat",
  "niko0919",
  "elsocas",
  "xxxxfabrixioxxxx",
  "wizradfirev2",
  "ztiorico",
  "lorenzopro12",
  "eljosesandobal",
  "davidsotelo",
  "pempitojuan12",
  "raptor_rtz_",
  "pico119",
  "jhorkpro_123",
  "tazcxk",
  "mateogo362",
  "ezequiel52xdlol3",
  "gadi456",
  "maruchan310",
  "kaka300esra",
  "raul120yep",
  "quitame_el_ban2",
  "holasoyuki1",
  "manquitux",
  "danixxxva23",
  "thiago2022",
  "pizzaluffys",
  "holad29",
  "zchxlx",
  "7k_nuv_xz",
  "chamin",
  "asier970",
  "offexcitedio",
  "offexcited",
  "yosoy_lionel",
  "mateoseguel",
  "wandeyt",
  "zapitelmasproooo",
  "wjrden2k",
  "sebitashot27",
  "gabriel_dmc",
  "elzaelwasa",
  "eljodidolord",
  "santi_rpg",
  "javierdn04",
  "rd_max",
  "jesustryhard",
  "xxlbenja12xx",
  "z_dropeando",
  "diegooo00f",
  "alexisp",
  "g5_oscar",
  "gaspar2007",
  "marpro726",
  "douxd12",
  "samu199",
  "pamilol",
  "gabrielf",
  "yo_soy_marco",
  "clau056",
  "yfxn",
  "jhonjairo2484",
  "yandrihaker",
  "josepower2",
  "xdjijijasijdisad",
  "thiagow8w",
  "angelmanuel03fr",
  "elmakako",
  "waikol",
  "soypikaa",
  "rip_ianpro",
  "fabian666",
  "jafet1526",
  "yosef2021",
  "iker97",
  "ship_44",
  "trolli147",
  "primalhero_yt_",
  "axxel_rxt",
  "reee",
  "ucafiwose7777hd",
  "troleador23",
  "eduardoced28",
  "freepotato14",
  "kilerianpro",
  "leonel97798",
  "lysander111111",
  "pupi",
  "ekoeduardo",
  "erroneo2",
  "joses",
  "hugopro",
  "camiloddddxdd",
  "oomasan",
  "pancho2306",
  "mecrillon",
  "alex12_vz",
  "zsxrx_",
  "kevineytor78",
  "tizicarp",
  "zv14",
  "juaninelviolin",
  "vicente3173",
  "umutlukarpuz",
  "joaquincito10",
  "imfelipeez",
  "terlyyy",
  "falconinsano",
  "srfastian",
  "snayderdeivy",
  "tanjiro_fandub",
  "papascaseras",
  "thiefass",
  "aleexkzzz",
  "ysats1213_yt",
  "crixloker",
  "crisuwuxdxdx",
  "alejogtx",
  "alexproyt262011",
  "josezerda001",
  "alexander9291",
  "martin8292",
  "thedoble09",
  "danixdunweynot",
  "diego07xd",
  "ian2550",
  "bobman1231",
  "uruguayo324",
  "fedex",
  "monito132",
  "camilonyt",
  "danielisaack",
  "jaredvowo",
  "sirjeremi09",
  "xxeawiavumxx",
  "xxjeffreyxx",
  "seke_x7",
  "anthonyxd200098",
  "7alex7",
  "demon7w72",
  "agus847",
  "vegetachileno",
  "patitokkkk",
  "tomy2103",
  "bearxdead",
  "xz_sami",
  "josefrcisco",
  "pesoplumapapa",
  "saul",
  "samred01",
  "galactico24",
  "triplej33",
  "kevinxd",
  "benjamichi123",
  "alixd243",
  "smoke732061",
  "xalex221785",
  "soy_ram",
  "alejoman1321",
  "ndesmelik",
  "six68for45",
  "esteban_2412",
  "yared",
  "xxxtriagasxxx",
  "alex_173",
  "juan1212",
  "deathboss1512",
  "edugamespro",
  "asaelrodres",
  "jair634",
  "mimi282828",
  "genaritoo",
  "lagzplays",
  "eletesech1233",
  "happialle12345",
  "saturno43",
  "elpermeki",
  "sebastian13xd",
  "angel_d3h",
  "kuromc165",
  "elcogefurros",
  "manuelxdxd",
  "elmessigoddd",
  "eduartrolll24",
  "sebaelcapito70",
  "bp_wazaaaxddd",
  "edwarddtrf",
  "flix4rell",
  "alas20",
  "manjar999",
  "juanin",
  "ggmatic",
  "overlju",
  "awebo2023",
  "carlos14242",
  "destructyonjr",
  "enzo_rip",
  "atila0003",
  "mikeow",
  "roly12345",
  "mrlon",
  "crazy_yes_2023",
  "cacocraft965yt",
  "panecito",
  "paloloxd9",
  "regnu78",
  "xdeasyclaps98",
  "lauchauwu",
  "mksaracen",
  "capo1",
  "bordanub",
  "whennnsopride",
  "tuto21xd",
  "akdbahisdghaild",
  "gg12v1",
  "_zvalen",
  "angelgr",
  "sahillaperra",
  "dwadlyricky",
  "emmanuelpro123",
  "taclop",
  "darcksoul_yt",
  "santiago_1723",
  "gothicfive59684",
  "alejandro80081",
  "chest_er",
  "davidfb323",
  "sensey_yt007",
  "xxjeremyxdxx30",
  "klever1234",
  "guillermo_ch29",
  "sebastian10999",
  "plexo_mc",
  "nashe_hola",
  "rodrigoxdsss1",
  "sasuke5773",
  "chilenito",
  "nasjetp",
  "dekersv",
  "sebas_bnf",
  "recyfrozz",
  "laxxh",
  "mangel007",
  "daniel12039488",
  "ssmnn",
  "daxcer_",
  "jsjxugdj",
  "leonardohsc678",
  "minato667",
  "joseluisclshe253",
  "zepeda",
  "batidodepato",
  "elpajasnt",
  "momo35",
  "megabox123",
  "guiver2",
  "sebas2230",
  "adrianalta",
  "darkcrash277_",
  "grottyta",
  "superfelipeyt",
  "tizi185",
  "z_castii",
  "mrkrabs",
  "gts2516",
  "fabrizio123",
  "1emiliano0",
  "cris2001",
  "tade05melapelas",
  "juancroso",
  "brookc",
  "cristofer209741",
  "btobias",
  "ravet",
  "kira472",
  "imlm_i4nixx",
  "chel_tbl_ezz",
  "fanysimp",
  "anthoni_quin",
  "xxg4m3rxx50k",
  "salchipapa_nashe",
  "parcadmc1",
  "khaitamlego1",
  "mihail_najak",
  "martinxxddd",
  "itachi_543",
  "cpcq",
  "qwertyuiop",
  "xfmrr7",
  "11karma",
  "daniel_jr",
  "notefra",
  "zcxrl",
  "avp999",
  "_fan2potatoes_",
  "mitk0bombata",
  "polotor019",
  "pablito_elcrack",
  "yusisifu",
  "art777fak",
  "ibrahimmozdmr",
  "italo53",
  "arasafo_",
  "jaimeambel",
  "tinoniiii67",
  "reyl",
  "youngcelebration",
  "wxo",
  "bp_mario",
  "aliffnajmi",
  "funds999",
  "dinoreyply",
  "reymono777jk",
  "dream_0812",
  "gavelo_23",
  "stumdent9",
  "tatass",
  "aminpro3000",
  "zairmali1050",
  "kingbest",
  "torres666",
  "numberonedark",
  "tomishape77",
  "dinohuacker",
  "ian555",
  "maigord",
  "denzelrp1234",
  "daniesnikerxd",
  "yufifiu",
  "ag3nt3_",
  "el_nosexd222",
  "samuddddxd",
  "roobin",
  "termikero",
  "npmokjk",
  "natanael_",
  "sssssss",
  "xxaituva20xx",
  "zzsebali",
  "mangouwu17",
  "furiatryhard",
  "aubokaha",
  "dx_fepe",
  "yefrito",
  "badboys",
  "jason23xx",
  "jose4g",
  "parantog",
  "dbl_chuchi",
  "dbl_m4nuc0s",
  "zlocro",
  "tortalunar_",
  "xxmikelxx16",
  "bp_muntartita",
  "banana201012345",
  "tilinaempresaria",
  "vefrancisco",
  "dbldrlapao",
  "rip_cumber",
  "sabuesodehielo",
  "zlocrito",
  "educrakep",
  "onsnqwj",
  "gaustsop",
  "benjici3287",
  "mateooo5",
  "_caca_",
  "joaquin99xl",
  "coolgirl0505",
  "gepi",
  "jimmy_02",
  "ccabor",
  "andrealessandrp",
  "proyto",
  "npmokj",
  "mate00535475775",
  "adrianpro",
  "byhamza3334",
  "tansulka",
  "sndkderrifle9812",
  "makako",
  "gasvet41",
  "gaby",
  "zalexito",
  "ralinra",
  "benitocamelo777",
  "tecomaster77",
  "alelo09",
  "loveability",
  "alanj9",
  "0_juan_0",
  "0_juan_01",
  "ciruzzodark_",
  "lautaro16medero",
  "md_kevin",
  "juniordg",
  "zbrouh",
  "bugueno",
  "alexx122020",
  "by_papitas",
  "jhojanxds",
  "kendekhg",
  "jhojanpnexd",
  "uri",
  "yassel90yt",
  "pez2026",
  "lapulga238",
  "13amarillo13",
  "alanfernando210",
  "santo2319",
  "davod123",
  "lokitotyv9",
  "hpix",
  "veraaa",
  "limoncha12",
  "seba123xdtrol",
  "itcmati",
  "joaquinrg_2011",
  "lilusandro",
  "mxauri2011",
  "triple1009",
  "messireydereyes",
  "marchino777",
  "hola32154",
  "tutioelmasrico",
  "kevjhhg20",
  "jonaz_1717",
  "minqo1311",
  "nagugameryt",
  "dietter",
  "zthemercuryxx",
  "juanspreen_",
  "gihant",
  "derek16x",
  "xxx_joel",
  "elmiguelyz",
  "ismael_1412",
  "gonzaloariel553",
  "rom_enpanada",
  "biso25",
  "george12345xd",
  "mixe_444",
  "benja855",
  "pipipi3000",
  "14elepepe14",
  "ppfrogspawn",
  "thetopwar",
  "romeogamer6554",
  "nahuekgg0",
  "juanpepito123456",
  "chimix92",
  "samibello44",
  "sxnnz",
  "mfddoom",
  "zclauxzz",
  "mateomape",
  "santiagovc11",
  "yasman555",
  "cinomol123",
  "matenmc17",
  "mateopalito2331",
  "broxdxd",
  "brandycito",
  "manuels8s",
  "therealphenix",
  "freshhillato_",
  "jsjokem",
  "felix1235",
  "santinoxdxd",
  "evas",
  "xxnyzbvv",
  "xxlolitox1232gxx",
  "asasadassds",
  "hakim",
  "felibauti",
  "secretlmdsds",
  "mpmateo",
  "traviesilloscot",
  "tizianoarre",
  "dimdasu",
  "cuqui69",
  "adriano_2007",
  "themacropvp",
  "haribri666",
  "jesussexoman10",
  "duromn124",
  "camigoat7",
  "settingv1",
  "imtxxry",
  "itachi1920",
  "bebezzzz",
  "codigo2070",
  "mr_arem",
  "amgroot",
  "valvuena564",
  "petaracio",
  "rellbuo012",
  "juxn32",
  "camilo_njyk",
  "eze__125",
  "nachitojj",
  "esteban2881",
  "nicolaspl123",
  "branko2617",
  "lexyus1",
  "carla_unu_",
  "samir2441",
  "estebanxdjsjs123",
  "rayturp77",
  "tkl_martin",
  "spudul",
  "sampepo2008",
  "alexander204534",
  "seus2123",
  "sherrifxxprime",
  "joaquinttm",
  "santorionrushrun",
  "jhosetfy",
  "carlos49",
  "tulasa62",
  "pepemataabuelas",
  "elmackcuak",
  "patitox0",
  "rodolfo_pvp",
  "maicol10203",
  "sparkytos",
  "gaboeloriginal98",
  "gabriels14152",
  "marpro728",
  "dapas65",
  "vichogey",
  "luks_good",
  "axnxtxhxoxnxy22",
  "fabiancom_045",
  "joss79",
  "lspingunosmelav",
  "zimlove___",
  "fabrizioandree",
  "pibegamer2656",
  "elinsanogoloso1",
  "andres251922",
  "sxmuelec",
  "dexter_mod",
  "daps0193",
  "playmode35o",
  "edwarxd212334",
  "lizandro0k",
  "fernandople",
  "roggerelminer10",
  "frkrkfkf",
  "juanfex5566",
  "lirmihax",
  "juanes8006",
  "yulixd2314",
  "tomateromano",
  "holacomotai",
  "dieguito55",
  "xxs0nt1xx",
  "vinizeraxz",
  "nanana43",
  "ryuquito",
  "thiagope16",
  "malvekexd",
  "jackoranita",
  "jordanxxx",
  "tisuby",
  "samuelinsano10",
  "crlxxx_585",
  "laquetepatio",
  "claudio12344083",
  "tentanker",
  "jesus_polo",
  "loco_11",
  "nasmek",
  "elzackyt",
  "eljakemc",
  "kamura_xd192",
  "zhigh_manzana",
  "cgamer",
  "matidon1214",
  "daxteri",
  "halejandro12",
  "wasaa12",
  "retrosh007craft",
  "maykol",
  "liedson2",
  "pollitofrito",
  "yulsg11",
  "menso112",
  "regood",
  "lokiao_xd",
  "djpanda333",
  "aguacate54",
  "sebastianyt2000",
  "zenifloo06",
  "its_juanes_mc",
  "im_elvis",
  "seilinxnotfound",
  "rubumc",
  "mariusqi",
  "nico1530",
  "dark_dou",
  "maykeluio14",
  "alexanderty1234",
  "po_yt_137",
  "exbich",
  "benju2300",
  "lautarovgx",
  "sebaxwolf",
  "facundofi",
  "pablo",
  "abrahanm12",
  "enano67",
  "silverstich",
  "chaopaco",
  "gatoyt",
  "amx_oscar",
  "srnapv",
  "xsamixx",
  "kingbluee",
  "pieroneva",
  "ajajaja",
  "yayesol",
  "nombre",
  "herbito00",
  "wawey124",
  "rafita522",
  "eltorllo",
  "znicqh_",
  "jefryper",
  "haru_2206",
  "dreamvmz",
  "xxjeanxx",
  "susukik",
  "miguelu4",
  "jusk_nova",
  "topgympartner",
  "s1ntipro089",
  "polo_sur",
  "rip_johan",
  "juanitoel_nito",
  "repollo511xd",
  "oirjgkvd",
  "juancho",
  "alejo_50",
  "cabosex2",
  "daniel12315",
  "papitas2xd",
  "skt_felipe",
  "thiagopl",
  "salario_mn22",
  "elinglesv4",
  "momos1212",
  "andrescitow",
  "yaxzking",
  "cleiton_supremo",
  "vaxel__",
  "user0192",
  "coldified",
  "sergiooq",
  "manuel777",
  "biribiri14",
  "jeambebecito",
  "jsjokem1",
  "shadowrmxd093",
  "marcelkonecny",
  "mqsood",
  "sky",
  "recloso",
  "marcelcamataru",
  "123bigboss123",
  "missa2v",
  "maxi565747",
  "sebascalvo",
  "sebacalvo",
  "kitiket_cat",
  "mario77882",
  "pandakill20271",
  "waaaaa",
  "bveast",
  "vueltita",
  "trankiet2222",
  "_lemon4ik_",
  "santy0986",
  "toni_rain",
  "yufifiuxd",
  "slo2090",
  "tigre234yt",
  "iamdemon99",
  "mateo1232",
  "tpamaicolnodis",
  "jedi123",
  "pepejudio12",
  "xhenoz",
  "elisabet",
  "theyasha",
  "rminitao",
  "benjaaaa1311",
  "necrosg",
  "shadowfreddygam",
  "sneider3030",
  "ayalita_god",
  "julito9",
  "hijodesilen_",
  "fir3td",
  "hector12341ww",
  "f4llo",
  "lauty_06",
  "roberto50tg",
  "killeador",
  "lamanoderaton",
  "tiagonahuel",
  "estiven014",
  "fuemos2222",
  "pichibo10",
  "ruso18",
  "itachi_12345678",
  "rodri_gm",
  "imisterthebeasti",
  "botti9190",
  "snake",
  "hsiacizgqw",
  "mejisiria",
  "silencio_",
  "ck_axel_ck",
  "hinek987",
  "theydahneryt",
  "ilrayquazas",
  "berni0399",
  "jaresd21",
  "spreen",
  "samkiller120",
  "ditocarepito123",
  "manu48mr",
  "ilorxn12",
  "cxrl",
  "camilota",
  "ksjqoqnkx",
  "depapinestor",
  "nutriajk",
  "ghostgx",
  "0qunthekan",
  "zfag0nlyx",
  "pingorpong",
  "nnukke",
  "peruvianbes2",
  "diablitogamer",
  "_zaleex0_",
  "decsdecs",
  "andresgomez8",
  "xrodx",
  "artuimo",
  "cejon",
  "tekachixd",
  "santi3750",
  "juan2020tc",
  "vitz_alexysxxv",
  "pepitoxdxd123",
  "pablo200229",
  "_antier_",
  "dpuegg",
  "gxrchu012",
  "kzilot",
  "tacho_d",
  "zdropdmc",
  "tumamatepega",
  "fabianmcgg",
  "dilanjeje",
];

AVAILABLE_MODES = ["response", "login", "sendcmd", "connect", "botting"];
PREFIX = "[BOT] ";
let bot;
let username;
let index = 0;
let file;
let fileContent;
let reconnectDelay;
let maxBots;
let commandDelay;
let proxies = []; // Proxy list from file
let proxy; // One proxy
let botConnections = 0; // Number of bots connected (botting mode)

// Get the path to the mcptool directory and read the settings
const mcptoolPath = getMcptoolPath();
const configPath = path.join(mcptoolPath, "settings.json");
const configContent = fs.readFileSync(configPath);
const settings = JSON.parse(configContent);

if (process.argv.length < 13) {
  console.log(
    "Usage: node bot.js <mode> <host> <port> <version> <username> <spaces> <file> <color> <proxy> <maxBots> <reconnectDelay>",
  );
  process.exit(1);
}

const mode = process.argv[2];

if (!AVAILABLE_MODES.includes(mode)) {
  console.log(
    `Invalid mode: ${mode}. Available modes: ${AVAILABLE_MODES.join(", ")}`,
  );
  process.exit(1);
}

const host = process.argv[3];
const port = parseInt(process.argv[4]);
const version = process.argv[5];

if (process.argv[6] === "-") {
  username =
    RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
} else {
  username = process.argv[6];
}

let spaces = process.argv[7];
spaces = " ".repeat(spaces);

if (mode == "sendcmd" || mode == "login") {
  file = process.argv[8];
  reconnectDelay = settings.reconnectDelay;
  commandDelay = settings.commandDelay;

  if (reconnectDelay === undefined) {
    reconnectDelay = 5000;
  }

  if (commandDelay === undefined) {
    commandDelay = 500;
  }
} else {
  file = null;
}
const color = process.argv[9] === "true";

if (process.argv[10] === "-") {
  proxy = null;
} else if (process.argv[10].endsWith(".txt")) {
  try {
    const proxyFilePath = process.argv[10];
    const proxyFileContent = fs.readFileSync(proxyFilePath, "utf8");
    proxies = proxyFileContent
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");
    console.log(`Loaded ${proxies.length} proxies from ${proxyFilePath}`);
  } catch (error) {
    console.error(`Error reading proxy file: ${error.message}`);
    process.exit(0);
  }
} else {
  proxy = process.argv[10];
}

if (process.argv[11] === "-") {
  maxBots = null;
} else {
  maxBots = parseInt(process.argv[11]);
}

if (process.argv[12] === "-") {
  reconnectDelay = null;
} else {
  reconnectDelay = parseInt(process.argv[12]);
}

/**
 * Method to read a file and return its content
 *
 * @param {string} file Path of the file to read
 * @returns {string[]} Content of the file
 * @throws {Error} If the file is not found
 */
function readFile(file) {
  if (!fs.existsSync(file)) {
    if (color) {
      console.log(
        mccolors.translateColors(
          `\n${spaces}§f[§c#§f] §cFile not found: §c§l${file}`,
        ),
      );
    } else {
      console.log(`\n${spaces}[#] File not found: ${file}`);
    }
    process.exit(1);
  }

  const data = fs.readFileSync(file, "utf8");
  const content = data.split("\n");
  return content;
}

if (file !== null) {
  fileContent = readFile(file);

  for (let i = 0; i < fileContent.length; i++) {
    fileContent[i] = fileContent[i].replace("\n", "").replace("\r", "");

    if (fileContent[i] === "") {
      fileContent.splice(i, 1);
      i--;
    }
  }
} else {
  fileContent = null;
}

function enterCommand() {
  rl.question("", (text) => {
    words = text.split(" ");
    const command = words.shift();

    if (command === "exit") {
      console.log(
        mccolors.translateColors(`\n${spaces}§f[§c#§f] §cExiting the bot.`),
      );
      process.exit(0);
    }

    if (bot === undefined) {
      console.log(
        mccolors.translateColors(
          `\n${spaces}§f[§c#§f] §cThe bot is not connected to the server.`,
        ),
      );
      enterCommand();
      return;
    }

    try {
      bot.chat(text);
    } catch (error) {}

    enterCommand();
  });
}

/**
 * Method to handle errors in Minecraft connections
 *
 * @param {Error} error Error object
 */
function error_handler(error) {
  let protocol = null;

  if (error.message.includes("is not supported")) {
    const version = error.message.match(/\d+\.\d+\.\d+/)[0];

    if (color) {
      console.log(
        mccolors.translateColors(
          `\n${spaces}§f[§c#§f] §cIncompatible Minecraft version: Version §c§l${version} §cis not currently supported.`,
        ),
      );
      return;
    }

    console.log(
      `§cIncompatible Minecraft version: Version §c§l${version} §cis not currently supported.`,
    );
  } else if (error.message.includes("unsupported protocol version:")) {
    try {
      protocol = error.message.match(/\d+/)["input"].split(": ")[1];
    } catch {
      protocol = error.message.match(/\d+/);
    }

    if (protocol != null) {
      if (color) {
        console.log(
          mccolors.translateColors(
            `\n${spaces}§f[§c#§f] §cIncompatible Minecraft version: Protocol §c§l${protocol} §cis not supported`,
          ),
        );

        return;
      }

      console.log(
        `§cIncompatible Minecraft version: Protocol §c§l${protocol} §cis not supported`,
      );
    } else {
      if (color) {
        console.log(
          mccolors.translateColors(
            `\n${spaces}§f[§c#§f] §cIncompatible Minecraft version: ${version} is not supported`,
          ),
        );

        return;
      }

      console.log(
        `§cIncompatible Minecraft version: ${version} is not supported`,
      );
    }
  } else {
    if (color) {
      console.log(
        mccolors.translateColors(
          `\n${spaces}§f[§c#§f] §cError: ${error.message}`,
        ),
      );
      return;
    } else {
      console.log(`§cError`);
    }
  }
}

class Bot {
  constructor(host, port, username, version, proxy) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.version = version;
    this.proxy = proxy;

    try {
      const botOptions = {
        host: this.host,
        port: this.port,
        username: this.username,
        version: this.version,
        fakeHost: this.host,
      };

      if (proxy) {
        const proxyIp = proxy.split(":")[0];
        const proxyPort = proxy.split(":")[1];
        const proxyOptions = {
          proxy: {
            host: proxyIp,
            port: parseInt(proxyPort),
            type: 5,
          },
          command: "connect",
          destination: {
            host: host,
            port: parseInt(port),
          },
        };
        this.bot = mineflayer.createBot({
          host: this.host,
          port: this.port,
          username: this.username,
          version: this.version,
          connect: (client) => {
            socks.createConnection(
              {
                proxy: {
                  host: proxyOptions.proxy.host,
                  port: proxyOptions.proxy.port,
                  type: proxyOptions.proxy.type,
                },
                command: "connect",
                destination: {
                  host: this.host,
                  port: this.port,
                },
              },
              (err, info) => {
                if (err) {
                  console.log(
                    `The proxy did not respond. Try again with a different proxy.`,
                  );
                  process.exit(0);
                }

                client.setSocket(info.socket);
                client.emit("connect");
              },
            );
          },
        });
      } else {
        // Crear el bot sin usar un proxy
        this.bot = mineflayer.createBot({
          host: this.host,
          port: this.port,
          username: this.username,
          version: this.version,
        });
      }

      bot = this.bot;

      this.bot.on("login", () => {
        if (mode === "response") {
          console.log(PREFIX + "Connected");
          process.exit(0);
        }

        console.log(
          mccolors.translateColors(
            `\n${spaces}§f[§c#§f] §aThe bot has connected to the server.`,
          ),
        );

        if (mode === "sendcmd") {
          function executeCommand(index) {
            return new Promise((resolve) => {
              setTimeout(() => {
                if (bot._client.socket.readyState !== "open") {
                  return;
                }

                console.log(
                  mccolors.translateColors(
                    `\n${spaces}§f[§c#§f] §fSending the command: §a${fileContent[index]}`,
                  ),
                );
                bot.chat(fileContent[index]);
                resolve();
              }, commandDelay);
            });
          }

          function executeNextCommand() {
            if (index < fileContent.length) {
              executeCommand(index).then(() => {
                if (bot._client.socket.readyState !== "open") {
                  return;
                }
                index += 1;
                executeNextCommand();
              });
            } else {
              console.log(
                mccolors.translateColors(
                  `\n${spaces}§f[§c#§f] §fThe bot has finished sending all the commands.`,
                ),
              );
              bot.quit();
              process.exit(1);
            }
          }
          executeNextCommand();
        }
      });

      this.bot.on("message", (message) => {
        let serverMessage = message.toAnsi();

        if (mode === "connect") {
          console.log(`${spaces}${serverMessage}`);
        }
      });

      this.bot.on("kicked", (reason) => {
        let kickedReason = getTextFromJSON(reason);

        if (kickedReason.length === 0) {
          kickedReason = reason;
        }

        if (kickedReason === null) {
          kickedReason = reason;
        }

        kickedReason = kickedReason.replace(/['"]/g, "");

        if (mode === "response") {
          console.log(PREFIX + "Disconnected " + kickedReason);
          this.bot.quit();
          process.exit(0);
        }

        console.log(
          mccolors.translateColors(
            `\n${spaces}§f[§c#§f] §fThe bot was kicked from the server for the following reason: §c${kickedReason}`,
          ),
        );

        if (mode === "connect") {
          this.bot.quit();
          process.exit(0);
        }

        if (mode === "sendcmd") {
          this.bot.quit();
          setTimeout(() => {
            new Bot(host, port, username, version);
            index -= 1;
          }, 5000);
        }
      });

      if (proxy) {
        setTimeout(() => {
          console.log("Timeout");
          process.exit(0);
        }, 8000);
      } else if (mode === "response") {
        setTimeout(() => {
          console.log("Timeout");
          process.exit(0);
        }, 5000);
      }
    } catch (error) {
      error_handler(error);
      process.exit(0);
    }
  }
}

/*
 * Botter class
 * @param {String} host
 * @param {String} port
 * @param {String} username
 * @param {String} version
 * @param {String} proxy
 */
class Botter {
  constructor(host, port, username, version, proxy) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.version = version;
    this.proxy = proxy;

    try {
      const proxyIp = proxy.split(":")[0];
      const proxyPort = proxy.split(":")[1];
      const proxyOptions = {
        proxy: {
          host: proxyIp,
          port: parseInt(proxyPort),
          type: 5,
        },
        command: "connect",
        destination: {
          host: host,
          port: parseInt(port),
        },
      };

      this.bot = mineflayer.createBot({
        host: this.host,
        port: this.port,
        username: this.username,
        version: this.version,
        hideErrors: true,
        connect: (client) => {
          socks.createConnection(
            {
              proxy: {
                host: proxyOptions.proxy.host,
                port: proxyOptions.proxy.port,
                type: proxyOptions.proxy.type,
              },
              command: "connect",
              destination: {
                host: this.host,
                port: this.port,
              },
            },
            (err, info) => {
              if (err) {
                console.log(PREFIX + "[Botter] ProxyTimeout");
                return;
              }
              client.setSocket(info.socket);
              client.emit("connect");
            },
          );
        },
      });

      this.setupListeners();
    } catch (error) {
      //error_handler(error);
    }
  }

  setupListeners() {
    this.bot.on("login", () => {
      console.log(PREFIX + "[Botter] Connected");
    });

    this.bot.once("spawn", () => {
      // Head spinning
      setInterval(() => {
        const randomYaw = Math.random() * 2 * Math.PI;
        const randomPitch = (Math.random() - 0.5) * Math.PI;
        this.bot.look(randomYaw, randomPitch);
      }, 50);

      // Random movement
      setInterval(
        () => {
          this.bot.setControlState("forward", true);
          setTimeout(
            () => {
              this.bot.setControlState("forward", false);
            },
            1000 + Math.random() * 2000,
          );
        },
        3000 + Math.random() * 5000,
      );
    });

    this.bot._client.on("kick_disconnect", (packet) => {
      console.log(PREFIX + "[Botter] Kicked");

      setTimeout(() => {
        new Botter(
          this.host,
          this.port,
          this.username,
          this.version,
          this.proxy,
        );
      }, 5000);
    });
    this.bot._client.on("disconnect", (packet) => {
      console.log(PREFIX + "[Botter] CantJoin");

      setTimeout(() => {
        new Botter(
          this.host,
          this.port,
          this.username,
          this.version,
          this.proxy,
        );
      }, 5000);
    });
  }

  sendChatMessage(message) {
    this.bot.chat(message);
  }
}

const bots = [];
const usedUsernames = [];

rl.on("line", (input) => {
  bots.forEach((bot) => {
    try {
      bot.sendChatMessage(input);
    } catch (error) {}
  });
});

if (mode === "botting") {
  function next() {
    if (botConnections < maxBots) {
      setTimeout(() => {
        do {
          username =
            RANDOM_USERNAMES[
              Math.floor(Math.random() * RANDOM_USERNAMES.length)
            ];
        } while (usedUsernames.includes(username));
        usedUsernames.push(username);
        random_proxy = proxies[Math.floor(Math.random() * proxies.length)];
        console.log(PREFIX + "[Botter] " + "Sending");
        const bot = new Botter(host, port, username, version, random_proxy);
        bots.push(bot);
        next();
      }, reconnectDelay);
    } else {
      process.exit(0);
    }
  }
  next();
} else {
  new Bot(host, port, username, version, proxy);
}

if (mode === "connect") {
  enterCommand();
}
