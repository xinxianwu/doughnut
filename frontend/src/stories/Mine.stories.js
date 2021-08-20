import Svg from '../components/svgs/link_types/SvgLinkTypeSpecialize.vue';
import SvgLinkTypeIcon from '../components/svgs/SvgLinkTypeIcon.vue';
import SvgAddSibling from '../components/svgs/SvgAddSibling.vue';
import NoteShow from '../components/notes/NoteShow.vue';
import Quiz from '../components/review/Quiz.vue';
import {colors} from '../colors';
import {linkTypeOptions} from '../../tests/notes/fixtures-basic';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { action } from '@storybook/addon-actions';

export default {
  component: Svg,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Svg',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
};

export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};

const Template = args => ({
  components: { Svg, SvgLinkTypeIcon, SvgAddSibling
   },
  data() {
    return { types: linkTypeOptions }
  },
  template: `
  <SvgAddSibling/>
  <div v-for="type in types" :key="type.value">
  {{type.label}}
  <SvgLinkTypeIcon :linkTypeId="0+type.value" width="80px" height="40px"/>
  <SvgLinkTypeIcon :linkTypeId="0+type.value" width="80px" height="40px" :inverseIcon="true"/>
  </div>
  `,
});
export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Svg',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};

const noteData = {
  "note": {
    "id": 1743,
    "noteContent": {
      "id": 1743,
      "title": "そうだ (伝聞)",
      "description": "接続\r\n\r\n　①伝聞\r\n　名詞＋だそう／だったそう\r\n　ナ形語幹＋なそうだ／だそうだ\r\n　イ形普通形＋そうだ\r\n　動詞普通形＋そうだ\r\n\r\n意味\r\n\r\n　①听说\r\n　　（据说这家店可以自由的打包带回家。）\r\n　（３）　お隣さん、子どもがもうすぐ生まれるそうだ。\r\n　　　　　（听说隔壁的孩子马上就要出生了。）\r\n　（４）　医者によると、 とても難しい手術だったそうだ。\r\n　　　　　（据医生说，手术非常难。）\r\n　（５）　Ａくん昨日事故に遭ったそうだ。だから今日休んでいるみたい。\r\n　　　　　（听说A君昨天遭遇事故了。所以今天好像休息了。）\r\n　（６）　今回の試験の合格率は１５％だったそうだ。\r\n　　　　　（听说这次考试的合格率是15%。）\r\n　（７）　隣町は大雨だったそうだが、こっちは快晴だった。\r\n　　　　　（听说邻镇下了大雨，但是我们这里是晴朗的天气。）\r\n　（８）　そこの洋食屋さん、ネットで人気で美味しいそうだ。\r\n　　　　　（听说那里的西餐厅在网上很受欢迎，好像很好吃。）",
      "url": "",
      "urlIsVideo": false,
      "useParentPicture": false,
      "skipReview": false,
      "hideTitleInArticle": false,
      "showAsBulletInArticle": false,
      "updatedAt": "2021-07-29T06:16:07.000+00:00"
    },
    "createdAt": "2021-06-04T23:21:04.000+00:00",
    "title": "そうだ (伝聞)",
    "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/d/0/d0ec0e9a-s.jpg",
    "parentId": 1503,
    "head": false,
    "noteTypeDisplay": "Child Note",
    "shortDescription": "接続\r\n\r\n　①伝聞\r\n　名詞＋だそう／だったそう\r\n　ナ形語幹＋なそうだ／だそうだ\r\n　イ形..."
  },
  "notebook": {
    "id": 15,
    "ownership": {
      "id": 1,
      "circle": null,
      "fromCircle": false
    },
    "skipReviewEntirely": false,
    "notebookType": "GENERAL"
  },
  "links": {
    "related to": {
      "direct": [
        {
          "id": 510,
          "targetNote": {
            "id": 1819,
            "createdAt": "2021-06-07T12:05:02.000+00:00",
            "title": "そうだ・ようだ・らしい・みたい",
            "notePicture": "/images/73/EF9079DB-2E06-4E0A-B4D7-522C44AF6154.jpeg",
            "parentId": 115,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "看完以上五篇後，我們可以總歸一個重點：\r\n\r\n（傳聞）そうだ：將聽來或看到的情報轉述他人\r\n（..."
          },
          "typeId": 1,
          "createdAt": "2021-06-07T12:06:04.000+00:00",
          "linkTypeLabel": "related to",
          "linkNameOfSource": "related note"
        }
      ],
      "reverse": []
    },
    "tagged by": {
      "direct": [
        {
          "id": 598,
          "targetNote": {
            "id": 1782,
            "createdAt": "2021-06-06T00:37:31.000+00:00",
            "title": "客観 / きゃっかん",
            "notePicture": "",
            "parentId": 1781,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": ""
          },
          "typeId": 8,
          "createdAt": "2021-06-09T23:18:39.000+00:00",
          "linkTypeLabel": "tagged by",
          "linkNameOfSource": "tag target"
        },
        {
          "id": 1435,
          "targetNote": {
            "id": 2217,
            "createdAt": "2021-06-27T22:45:10.000+00:00",
            "title": "伝聞",
            "notePicture": null,
            "parentId": 1818,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": null
          },
          "typeId": 8,
          "createdAt": "2021-06-27T22:45:38.000+00:00",
          "linkTypeLabel": "tagged by",
          "linkNameOfSource": "tag target"
        }
      ],
      "reverse": []
    },
    "confused with": {
      "direct": [],
      "reverse": [
        {
          "id": 436,
          "sourceNote": {
            "id": 1748,
            "createdAt": "2021-06-04T23:23:43.000+00:00",
            "title": "そうだ(様態と可能性)",
            "notePicture": "",
            "parentId": 1503,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": ""
          },
          "typeId": 23,
          "createdAt": "2021-06-04T23:24:32.000+00:00",
          "linkTypeLabel": "confused with",
          "linkNameOfSource": "thing"
        },
        {
          "id": 445,
          "sourceNote": {
            "id": 1752,
            "createdAt": "2021-06-05T23:17:34.000+00:00",
            "title": "らしい (伝聞／推測)",
            "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/0/a/0a362cbe-s.jpg",
            "parentId": 1501,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "意味\r\n\r\n　①好像…\r\n　　似乎…\r\n　\r\n　①伝聞／推測\r\n　他人から聞いた情報や、状況か..."
          },
          "typeId": 23,
          "createdAt": "2021-06-05T01:00:30.000+00:00",
          "linkTypeLabel": "confused with",
          "linkNameOfSource": "thing"
        }
      ]
    },
    "using": {
      "direct": [
        {
          "id": 1938,
          "targetNote": {
            "id": 2423,
            "createdAt": "2021-07-06T13:27:15.000+00:00",
            "title": "普通形[な/である]+〜",
            "notePicture": null,
            "parentId": 2369,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": null
          },
          "typeId": 15,
          "createdAt": "2021-07-08T12:54:16.000+00:00",
          "linkTypeLabel": "using",
          "linkNameOfSource": "user"
        }
      ],
      "reverse": []
    },
    "similar to": {
      "direct": [],
      "reverse": [
        {
          "id": 3556,
          "sourceNote": {
            "id": 2216,
            "createdAt": "2021-06-27T22:44:04.000+00:00",
            "title": "〜って/〜んだって（伝聞）",
            "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/6/d/6d9daff5-s.jpg",
            "parentId": 2212,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "【〜って・〜んだって＝〜そうだ・〜らしい】\r\n\r\n［例文］\r\n①あそこのパンはおいしいんだって..."
          },
          "typeId": 22,
          "createdAt": "2021-08-14T00:18:30.000+00:00",
          "linkTypeLabel": "similar to",
          "linkNameOfSource": "thing"
        }
      ]
    },
    "a specialization of": {
      "direct": [
        {
          "id": 1254,
          "targetNote": {
            "id": 1503,
            "createdAt": "2021-06-04T23:04:46.000+00:00",
            "title": "そうだ",
            "notePicture": "",
            "parentId": 1604,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "　２つの意味があります。それぞれ接続が違うので注意してください。\n\n　①伝聞\n　②様態\n　"
          },
          "typeId": 2,
          "createdAt": "2021-06-24T13:57:41.000+00:00",
          "linkTypeLabel": "a specialization of",
          "linkNameOfSource": "specification"
        }
      ],
      "reverse": [
        {
          "id": 1737,
          "sourceNote": {
            "id": 2374,
            "createdAt": "2021-07-05T13:19:59.000+00:00",
            "title": "～によると[～によれば]、〜そうだ",
            "notePicture": null,
            "parentId": 1743,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "前件には「～によると」「～によれば」などの情報の根源を示す内容が呼応しやすいです。"
          },
          "typeId": 2,
          "createdAt": "2021-07-05T13:19:59.000+00:00",
          "linkTypeLabel": "a specialization of",
          "linkNameOfSource": "specification"
        }
      ]
    },
    "an attribute of": {
      "direct": [],
      "reverse": [
        {
          "id": 1023,
          "sourceNote": {
            "id": 2044,
            "createdAt": "2021-06-20T10:38:16.000+00:00",
            "title": "伝聞のらしい、そうだ",
            "notePicture": "",
            "parentId": 2217,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "らしいは【見たり聞いたりして推量】【伝聞情報で推量】\r\n\r\n 「そうだ」（傳聞）是將聽到或看到..."
          },
          "typeId": 10,
          "createdAt": "2021-06-20T10:39:04.000+00:00",
          "linkTypeLabel": "an attribute of",
          "linkNameOfSource": "attribute"
        }
      ]
    },
    "an example of": {
      "direct": [],
      "reverse": [
        {
          "id": 1736,
          "sourceNote": {
            "id": 2373,
            "createdAt": "2021-07-05T13:16:24.000+00:00",
            "title": "天気予報によると、所によっては大雨になるそうだ。",
            "notePicture": null,
            "parentId": 393,
            "head": false,
            "noteTypeDisplay": "Child Note",
            "shortDescription": "（根据天气预报，有的地方会下大雨。）"
          },
          "typeId": 17,
          "createdAt": "2021-07-05T13:17:39.000+00:00",
          "linkTypeLabel": "an example of",
          "linkNameOfSource": "example"
        }
      ]
    }
  },
  "navigation": {
    "previousSiblingId": null,
    "previousId": 1503,
    "nextId": 2174,
    "nextSiblingId": 1744
  },
  "ancestors": [
    {
      "id": 392,
      "createdAt": "2021-03-26T23:29:10.000+00:00",
      "title": "日本語",
      "notePicture": "",
      "parentId": null,
      "head": true,
      "noteTypeDisplay": "Child Note",
      "shortDescription": ""
    },
    {
      "id": 1413,
      "createdAt": "2021-05-13T00:03:29.000+00:00",
      "title": "単語",
      "notePicture": "",
      "parentId": 392,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": ""
    },
    {
      "id": 1594,
      "createdAt": "2021-05-26T22:56:26.000+00:00",
      "title": "品詞",
      "notePicture": "https://stat.ameba.jp/user_images/20200217/21/i-wataame/be/18/j/o0776136114714766926.jpg?caw=800",
      "parentId": 1413,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": ""
    },
    {
      "id": 1604,
      "createdAt": "2021-05-29T22:27:49.000+00:00",
      "title": "助動詞",
      "notePicture": "",
      "parentId": 1594,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": "活用ありの付属語"
    },
    {
      "id": 1503,
      "createdAt": "2021-06-04T23:04:46.000+00:00",
      "title": "そうだ",
      "notePicture": "",
      "parentId": 1604,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": "　２つの意味があります。それぞれ接続が違うので注意してください。\n\n　①伝聞\n　②様態\n　"
    }
  ],
  "children": [
    {
      "id": 2174,
      "createdAt": "2021-06-26T00:09:02.000+00:00",
      "title": "そうだ伝聞の否定",
      "notePicture": "",
      "parentId": 1743,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": "［伝聞］を表す「〜そうだ」の否定形は「〜ないそうだ」「〜なかったそうだ」になりますので、気をつ..."
    },
    {
      "id": 2374,
      "createdAt": "2021-07-05T13:19:59.000+00:00",
      "title": "～によると[～によれば]、〜そうだ",
      "notePicture": null,
      "parentId": 1743,
      "head": false,
      "noteTypeDisplay": "Child Note",
      "shortDescription": "前件には「～によると」「～によれば」などの情報の根源を示す内容が呼応しやすいです。"
    }
  ],
  "owns": true
}

export const NoteShowStory = args => ({
  components: { NoteShow
   },
  data() {
    return {noteData: noteData, colors, linkTypeOptions};
  },
  setup() {
    return { args, ...actionsData };
  },
  template: `
  <NoteShow v-bind="noteData" :staticInfo="{linkTypeOptions, colors}"/>
  `,
});

const repetition = {
  "reviewPointViewedByUser": {
    "reviewPoint": {
      "id": 3063,
      "lastReviewedAt": "2021-08-11T12:15:55.000+00:00",
      "nextReviewAt": "2021-08-20T00:15:55.000+00:00",
      "initialReviewedAt": "2021-07-21T23:35:39.000+00:00",
      "repetitionCount": 9,
      "forgettingCurveIndex": 171,
      "removedFromReview": false,
      "noteId": null,
      "linkId": 1033
    },
    "noteViewedByUser": null,
    "linkViewedByUser": {
      "id": 1033,
      "sourceNoteViewedByUser": {
        "note": {
          "id": 1473,
          "noteContent": {
            "id": 1473,
            "title": "然も / さも",
            "description": "1. really (seem, appear, etc.); truly; evidently​Usually written using kana alone\r\n笑いで誤魔化すと、亜美さんはさも不機嫌そうに眉を寄せた。Ami frowned in a very un-amused way as I brushed her off with a laugh.\r\n\r\n2. in that way​Usually written using kana alone, See also さもありなん\r\n\r\n副】\r\n（1）非常，很，实在，真。（本当にそれらしいさま。）\r\n　 さも残念そうな顔／仿佛非常遗憾的表情。\r\n　 さもうれしそうにみえる／显得很高兴的样子。\r\n　 さも熱心なふうをよそおう／装得很热心。\r\n（2）那样，好象，仿佛。（そのように。そのとおり。）\r\n　 さもありそうなことだ／好象是会有的事情；很可能有的事情。\r\n　 さもいいことづくめのように言う／说得天花乱坠。",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-06-20T12:48:11.000+00:00"
          },
          "createdAt": "2021-05-18T23:08:00.000+00:00",
          "parentId": 1411,
          "title": "然も / さも",
          "notePicture": "",
          "head": false,
          "shortDescription": "1. really (seem, appear, etc.); truly; evidentl..."
        },
        "notebook": {
          "id": 15,
          "ownership": {
            "id": 1,
            "circle": null,
            "fromCircle": false
          },
          "skipReviewEntirely": false
        },
        "links": {
          "an instance of": {
            "direct": [
              {
                "id": 1033,
                "targetNote": {
                  "id": 1411,
                  "createdAt": "2021-05-12T23:58:50.000+00:00",
                  "parentId": 1594,
                  "title": "副詞",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "Adverb　/ふくし/"
                },
                "typeId": 4,
                "createdAt": "2021-06-20T12:48:26.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3711,
                "targetNote": {
                  "id": 1374,
                  "createdAt": "2021-05-27T23:46:20.000+00:00",
                  "parentId": 1326,
                  "title": "比喩の前項",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "前項に「まるで」「あたかも」「さも」が呼応することもあります。\r\n\r\n「あたかも」と「まるで」..."
                },
                "typeId": 4,
                "createdAt": "2021-08-17T13:16:01.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              }
            ],
            "reverse": []
          },
          "an example of": {
            "direct": [],
            "reverse": [
              {
                "id": 2544,
                "sourceNote": {
                  "id": 2756,
                  "createdAt": "2021-07-21T23:33:00.000+00:00",
                  "parentId": 393,
                  "title": "さも残念そうな顔",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "仿佛非常遗憾的表情。"
                },
                "typeId": 17,
                "createdAt": "2021-07-21T23:33:12.000+00:00",
                "linkTypeLabel": "an example of",
                "linkNameOfSource": "example"
              },
              {
                "id": 2546,
                "sourceNote": {
                  "id": 2757,
                  "createdAt": "2021-07-21T23:34:13.000+00:00",
                  "parentId": 393,
                  "title": "さもいいことづくめのように言う",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "说得天花乱坠。"
                },
                "typeId": 17,
                "createdAt": "2021-07-21T23:34:27.000+00:00",
                "linkTypeLabel": "an example of",
                "linkNameOfSource": "example"
              }
            ]
          },
          "confused with": {
            "direct": [
              {
                "id": 333,
                "targetNote": {
                  "id": 1414,
                  "createdAt": "2021-05-13T00:06:18.000+00:00",
                  "parentId": 1411,
                  "title": "丸で / まるで",
                  "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/4/1/414a158c-s.jpg",
                  "head": false,
                  "shortDescription": "/まるで/\r\n\r\nAdverb\r\n1. quite; entirely; completely..."
                },
                "typeId": 23,
                "createdAt": "2021-05-27T23:29:14.000+00:00",
                "linkTypeLabel": "confused with",
                "linkNameOfSource": "thing"
              }
            ],
            "reverse": []
          }
        },
        "navigation": {
          "previousSiblingId": 1441,
          "previousId": 1441,
          "nextId": 1478,
          "nextSiblingId": 1478
        },
        "ancestors": [
          {
            "id": 392,
            "createdAt": "2021-03-26T23:29:10.000+00:00",
            "parentId": null,
            "title": "日本語",
            "notePicture": "",
            "head": true,
            "shortDescription": ""
          },
          {
            "id": 1413,
            "createdAt": "2021-05-13T00:03:29.000+00:00",
            "parentId": 392,
            "title": "単語",
            "notePicture": "",
            "head": false,
            "shortDescription": ""
          },
          {
            "id": 1594,
            "createdAt": "2021-05-26T22:56:26.000+00:00",
            "parentId": 1413,
            "title": "品詞",
            "notePicture": "https://stat.ameba.jp/user_images/20200217/21/i-wataame/be/18/j/o0776136114714766926.jpg?caw=800",
            "head": false,
            "shortDescription": ""
          },
          {
            "id": 1411,
            "createdAt": "2021-05-12T23:58:50.000+00:00",
            "parentId": 1594,
            "title": "副詞",
            "notePicture": "",
            "head": false,
            "shortDescription": "Adverb　/ふくし/"
          }
        ],
        "children": [],
        "owns": true
      },
      "linkTypeLabel": "an instance of",
      "typeId": 4,
      "targetNoteViewedByUser": {
        "note": {
          "id": 1411,
          "noteContent": {
            "id": 1411,
            "title": "副詞",
            "description": "Adverb　/ふくし/",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-05-12T23:58:50.000+00:00"
          },
          "createdAt": "2021-05-12T23:58:50.000+00:00",
          "parentId": 1594,
          "title": "副詞",
          "notePicture": "",
          "head": false,
          "shortDescription": "Adverb　/ふくし/"
        },
        "notebook": {
          "id": 15,
          "ownership": {
            "id": 1,
            "circle": null,
            "fromCircle": false
          },
          "skipReviewEntirely": false
        },
        "links": {
          "an instance of": {
            "direct": [],
            "reverse": [
              {
                "id": 809,
                "sourceNote": {
                  "id": 1988,
                  "createdAt": "2021-06-17T00:22:59.000+00:00",
                  "parentId": 1987,
                  "title": "どう",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "【副】\r\n（1）怎么，怎么样；如何〔どんなふうに〕。\r\n　 君ならどうする／若是你的话，怎么办..."
                },
                "typeId": 4,
                "createdAt": "2021-06-17T00:23:56.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 819,
                "sourceNote": {
                  "id": 1990,
                  "createdAt": "2021-06-17T00:40:35.000+00:00",
                  "parentId": 1804,
                  "title": "幾つ / いくつ",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "（1）几个，多少，几岁。多少（年头）的数量，亦指年龄。（どれぐらいの数、また、年齢。何個。何歳..."
                },
                "typeId": 4,
                "createdAt": "2021-06-17T00:40:50.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 821,
                "sourceNote": {
                  "id": 1991,
                  "createdAt": "2021-06-17T00:43:21.000+00:00",
                  "parentId": 1804,
                  "title": "いくら / 幾ら",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "【名·副】\r\n（1）多少。（不定量や不定の度合を言い、また、量・程度を問うのに使う。）\r\n　 ..."
                },
                "typeId": 4,
                "createdAt": "2021-06-17T00:43:34.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 827,
                "sourceNote": {
                  "id": 1992,
                  "createdAt": "2021-06-17T02:39:51.000+00:00",
                  "parentId": 1764,
                  "title": "なぜ / 何故",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": ""
                },
                "typeId": 4,
                "createdAt": "2021-06-17T02:40:38.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 839,
                "sourceNote": {
                  "id": 1999,
                  "createdAt": "2021-06-17T13:37:31.000+00:00",
                  "parentId": 2603,
                  "title": "何だか / なんだか",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "（1）是什么。（なにやら。）\r\n　 その絵が何だかわかるか。／那幅画画的是什么你知道吗？\r\n（..."
                },
                "typeId": 4,
                "createdAt": "2021-06-17T13:37:43.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 870,
                "sourceNote": {
                  "id": 632,
                  "createdAt": "2021-06-05T00:06:06.000+00:00",
                  "parentId": 1411,
                  "title": "ほぼ / 略 / 粗",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "almost; roughly; approximately\r\n\r\n大略，大体上，大致。（だい..."
                },
                "typeId": 4,
                "createdAt": "2021-06-18T00:29:08.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 871,
                "sourceNote": {
                  "id": 1410,
                  "createdAt": "2021-05-12T23:33:58.000+00:00",
                  "parentId": 1411,
                  "title": "真逆 / まさか",
                  "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/2/5/2519e5dc-s.jpg",
                  "head": false,
                  "shortDescription": "/まさか/\r\n\r\n1. by no means; never!; well, I never!..."
                },
                "typeId": 4,
                "createdAt": "2021-06-18T00:29:26.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 894,
                "sourceNote": {
                  "id": 1432,
                  "createdAt": "2021-05-15T22:50:00.000+00:00",
                  "parentId": 1411,
                  "title": "何卒",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "/なにとぞ/\r\n\r\nAdverb\r\n1. please; kindly; I beg of y..."
                },
                "typeId": 4,
                "createdAt": "2021-06-19T04:17:54.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 895,
                "sourceNote": {
                  "id": 1578,
                  "createdAt": "2021-05-26T00:38:14.000+00:00",
                  "parentId": 1986,
                  "title": "どんなに",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "Adverb\r\n1. how; how much; to what extent​\r\n私がどん..."
                },
                "typeId": 4,
                "createdAt": "2021-06-19T04:21:10.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 908,
                "sourceNote": {
                  "id": 1430,
                  "createdAt": "2021-05-15T22:45:52.000+00:00",
                  "parentId": 1411,
                  "title": "どうぞ",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "1. please; kindly; I beg of you​See also 何卒\r\nどう..."
                },
                "typeId": 4,
                "createdAt": "2021-06-19T09:45:56.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 1033,
                "sourceNote": {
                  "id": 1473,
                  "createdAt": "2021-05-18T23:08:00.000+00:00",
                  "parentId": 1411,
                  "title": "然も / さも",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "1. really (seem, appear, etc.); truly; evidentl..."
                },
                "typeId": 4,
                "createdAt": "2021-06-20T12:48:26.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 1632,
                "sourceNote": {
                  "id": 108,
                  "createdAt": "2021-03-12T23:48:28.000+00:00",
                  "parentId": 1411,
                  "title": "恐らく",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "Adverb\r\n1. perhaps; likely; probably; I dare sa..."
                },
                "typeId": 4,
                "createdAt": "2021-07-02T23:04:38.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2068,
                "sourceNote": {
                  "id": 2519,
                  "createdAt": "2021-07-09T22:42:58.000+00:00",
                  "parentId": 107,
                  "title": "流石/ さすが",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "【副】\r\n（1）真不愧，到底是，的确，果然（是）。（予想どおりに。やはり。）\r\n　 流石は君だ..."
                },
                "typeId": 4,
                "createdAt": "2021-07-09T22:43:10.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2172,
                "sourceNote": {
                  "id": 2570,
                  "createdAt": "2021-07-12T23:21:02.000+00:00",
                  "parentId": 107,
                  "title": "又 / また",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "【名】\r\n另，别，他。（同じような状況が少し間を置いて繰り返されることを表す。）\r\n　 又の名..."
                },
                "typeId": 4,
                "createdAt": "2021-07-12T23:21:24.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2245,
                "sourceNote": {
                  "id": 2602,
                  "createdAt": "2021-07-14T23:48:22.000+00:00",
                  "parentId": 1575,
                  "title": "何 / なに",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "【代・副】\r\n（1）什么，何；哪个。（名や実体の知れないもの。どれ・どの。）\r\n　 これは何。..."
                },
                "typeId": 4,
                "createdAt": "2021-07-14T23:49:06.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2263,
                "sourceNote": {
                  "id": 1478,
                  "createdAt": "2021-05-20T12:10:26.000+00:00",
                  "parentId": 1411,
                  "title": "どうやら",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "Adverb\r\n1. possibly; apparently; (seem) likely;..."
                },
                "typeId": 4,
                "createdAt": "2021-07-15T00:19:02.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2277,
                "sourceNote": {
                  "id": 1726,
                  "createdAt": "2021-06-03T00:05:19.000+00:00",
                  "parentId": 1413,
                  "title": "いざ",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "感】\r\n喂，唉，好啦，来吧，一旦，走吧。劝诱某人或决心做某事时说的词语。（人を誘ったり、気負い..."
                },
                "typeId": 4,
                "createdAt": "2021-07-15T13:31:11.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2305,
                "sourceNote": {
                  "id": 1414,
                  "createdAt": "2021-05-13T00:06:18.000+00:00",
                  "parentId": 1411,
                  "title": "丸で / まるで",
                  "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/4/1/414a158c-s.jpg",
                  "head": false,
                  "shortDescription": "/まるで/\r\n\r\nAdverb\r\n1. quite; entirely; completely..."
                },
                "typeId": 4,
                "createdAt": "2021-07-16T03:53:39.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2366,
                "sourceNote": {
                  "id": 2658,
                  "createdAt": "2021-07-17T07:56:21.000+00:00",
                  "parentId": 2009,
                  "title": "さらに / 更に",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）更，更加，更进一步。（いっそう。）\r\n　 更に努力する。／更加努力。\r\n　 雨は更に激し..."
                },
                "typeId": 4,
                "createdAt": "2021-07-17T07:56:47.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2410,
                "sourceNote": {
                  "id": 1479,
                  "createdAt": "2021-05-20T12:13:21.000+00:00",
                  "parentId": 1411,
                  "title": "どうも",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "thank you; thanks​Abbreviation, See also どうも有難う..."
                },
                "typeId": 4,
                "createdAt": "2021-07-18T11:57:41.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2458,
                "sourceNote": {
                  "id": 1441,
                  "createdAt": "2021-05-15T23:50:50.000+00:00",
                  "parentId": 1411,
                  "title": "恰も / あたかも/ 宛も",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "恰似;犹如;宛如;正好;正是\n[ 恰も;宛も ]\n(1)その日はあたかも春のような陽気だった。..."
                },
                "typeId": 4,
                "createdAt": "2021-07-19T10:50:25.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 2596,
                "sourceNote": {
                  "id": 2780,
                  "createdAt": "2021-07-22T23:54:26.000+00:00",
                  "parentId": 2779,
                  "title": "一応 / 一往",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "/いちおう/\r\n大致，大体。首先。暂且。（十分といえないがとりあえず。ひとまず。ともかく。）\r..."
                },
                "typeId": 4,
                "createdAt": "2021-07-22T23:56:05.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3103,
                "sourceNote": {
                  "id": 2136,
                  "createdAt": "2021-06-24T13:49:14.000+00:00",
                  "parentId": 1816,
                  "title": "そう",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "（1）〔前の話を受けて〕那样.\r\n　 もしそうならば／如果是那样（的话）.\r\n　 そうでなけれ..."
                },
                "typeId": 4,
                "createdAt": "2021-08-03T23:34:53.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3154,
                "sourceNote": {
                  "id": 3107,
                  "createdAt": "2021-08-05T00:06:35.000+00:00",
                  "parentId": 1804,
                  "title": "どの位/どのくらい",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "多少，程度如何。（どれほど。いくらぐらい。どの程度；（副詞的に用いて）程度のはなはだしいさま。..."
                },
                "typeId": 4,
                "createdAt": "2021-08-05T00:07:10.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3271,
                "sourceNote": {
                  "id": 3169,
                  "createdAt": "2021-08-07T22:23:18.000+00:00",
                  "parentId": 1411,
                  "title": "ずっと",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）（比……）……得多de，……得很，还要……。（数量、程度にはなはだしい開きのあるさま。は..."
                },
                "typeId": 4,
                "createdAt": "2021-08-07T22:23:18.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3272,
                "sourceNote": {
                  "id": 3170,
                  "createdAt": "2021-08-07T22:24:14.000+00:00",
                  "parentId": 1411,
                  "title": "やっと",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）好不容易，终于，才。（長い時間を要したが、ようやく。）\r\n　 やっと彼女をくどいた／好不..."
                },
                "typeId": 4,
                "createdAt": "2021-08-07T22:24:14.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3273,
                "sourceNote": {
                  "id": 3171,
                  "createdAt": "2021-08-07T22:27:13.000+00:00",
                  "parentId": 1411,
                  "title": "屹度 / 急度 / きっと",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "Adverb (fukushi)\r\n1. surely; undoubtedly; almos..."
                },
                "typeId": 4,
                "createdAt": "2021-08-07T22:27:13.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3276,
                "sourceNote": {
                  "id": 3172,
                  "createdAt": "2021-08-07T22:30:35.000+00:00",
                  "parentId": 1411,
                  "title": "どっと",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）许多人一起发出声音状。（大勢の人の歓声・笑い声などが聞こえるさま。）\r\n　 皆がどっと笑..."
                },
                "typeId": 4,
                "createdAt": "2021-08-07T22:30:35.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3278,
                "sourceNote": {
                  "id": 3173,
                  "createdAt": "2021-08-07T22:32:25.000+00:00",
                  "parentId": 1411,
                  "title": "もっと",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）更,更加。（さらに。）\r\n　 もっと右へ寄ってください。／请再靠右边一些。\r\n　 もっと..."
                },
                "typeId": 4,
                "createdAt": "2021-08-07T22:32:25.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3533,
                "sourceNote": {
                  "id": 1574,
                  "createdAt": "2021-05-26T00:31:35.000+00:00",
                  "parentId": 1518,
                  "title": "どのように",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": "Expression, Adverb\n1. how; in what way\n\n\n怎么样。（ど..."
                },
                "typeId": 4,
                "createdAt": "2021-08-13T03:30:45.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3607,
                "sourceNote": {
                  "id": 3345,
                  "createdAt": "2021-08-15T23:29:43.000+00:00",
                  "parentId": 3344,
                  "title": "決して",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "绝对（不），断然（不）。（必ず。どうしても。）\r\n　 ご恩は決して忘れません。／决不忘您的恩情..."
                },
                "typeId": 4,
                "createdAt": "2021-08-15T23:29:56.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              },
              {
                "id": 3697,
                "sourceNote": {
                  "id": 3396,
                  "createdAt": "2021-08-16T23:48:19.000+00:00",
                  "parentId": 3395,
                  "title": "全く/まったく",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "（1）完全，全然。（否定表現と呼応して、それを強調する。全然。まるっきり。）\r\n　 全く知らな..."
                },
                "typeId": 4,
                "createdAt": "2021-08-16T23:48:31.000+00:00",
                "linkTypeLabel": "an instance of",
                "linkNameOfSource": "instance"
              }
            ]
          },
          "related to": {
            "direct": [],
            "reverse": [
              {
                "id": 2316,
                "sourceNote": {
                  "id": 2639,
                  "createdAt": "2021-07-16T22:55:53.000+00:00",
                  "parentId": 2638,
                  "title": "相対時間名詞",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "今日、明日、昨日、明後日、一昨日、来月、先月、来年などの今が基準（発話時が基準）となって示され..."
                },
                "typeId": 1,
                "createdAt": "2021-07-16T22:56:10.000+00:00",
                "linkTypeLabel": "related to",
                "linkNameOfSource": "related note"
              }
            ]
          },
          "a specialization of": {
            "direct": [
              {
                "id": 869,
                "targetNote": {
                  "id": 2008,
                  "createdAt": "2021-06-18T00:08:01.000+00:00",
                  "parentId": 2005,
                  "title": "活用なし自立語",
                  "notePicture": "",
                  "head": false,
                  "shortDescription": ""
                },
                "typeId": 2,
                "createdAt": "2021-06-18T00:26:00.000+00:00",
                "linkTypeLabel": "a specialization of",
                "linkNameOfSource": "specification"
              }
            ],
            "reverse": [
              {
                "id": 1519,
                "sourceNote": {
                  "id": 2261,
                  "createdAt": "2021-06-29T23:00:04.000+00:00",
                  "parentId": 1594,
                  "title": "数量詞",
                  "notePicture": null,
                  "head": false,
                  "shortDescription": "数量詞（すうりょうし、英: Quantifier）は、数量を示す単語または句をいう。数量を特定..."
                },
                "typeId": 2,
                "createdAt": "2021-06-29T23:02:30.000+00:00",
                "linkTypeLabel": "a specialization of",
                "linkNameOfSource": "specification"
              }
            ]
          }
        },
        "navigation": {
          "previousSiblingId": 1985,
          "previousId": 2713,
          "nextId": 632,
          "nextSiblingId": 1604
        },
        "ancestors": [
          {
            "id": 392,
            "createdAt": "2021-03-26T23:29:10.000+00:00",
            "parentId": null,
            "title": "日本語",
            "notePicture": "",
            "head": true,
            "shortDescription": ""
          },
          {
            "id": 1413,
            "createdAt": "2021-05-13T00:03:29.000+00:00",
            "parentId": 392,
            "title": "単語",
            "notePicture": "",
            "head": false,
            "shortDescription": ""
          },
          {
            "id": 1594,
            "createdAt": "2021-05-26T22:56:26.000+00:00",
            "parentId": 1413,
            "title": "品詞",
            "notePicture": "https://stat.ameba.jp/user_images/20200217/21/i-wataame/be/18/j/o0776136114714766926.jpg?caw=800",
            "head": false,
            "shortDescription": ""
          }
        ],
        "children": [
          {
            "id": 632,
            "createdAt": "2021-06-05T00:06:06.000+00:00",
            "parentId": 1411,
            "title": "ほぼ / 略 / 粗",
            "notePicture": "",
            "head": false,
            "shortDescription": "almost; roughly; approximately\r\n\r\n大略，大体上，大致。（だい..."
          },
          {
            "id": 1410,
            "createdAt": "2021-05-12T23:33:58.000+00:00",
            "parentId": 1411,
            "title": "真逆 / まさか",
            "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/2/5/2519e5dc-s.jpg",
            "head": false,
            "shortDescription": "/まさか/\r\n\r\n1. by no means; never!; well, I never!..."
          },
          {
            "id": 108,
            "createdAt": "2021-03-12T23:48:28.000+00:00",
            "parentId": 1411,
            "title": "恐らく",
            "notePicture": "",
            "head": false,
            "shortDescription": "Adverb\r\n1. perhaps; likely; probably; I dare sa..."
          },
          {
            "id": 1414,
            "createdAt": "2021-05-13T00:06:18.000+00:00",
            "parentId": 1411,
            "title": "丸で / まるで",
            "notePicture": "https://livedoor.blogimg.jp/edewakaru/imgs/4/1/414a158c-s.jpg",
            "head": false,
            "shortDescription": "/まるで/\r\n\r\nAdverb\r\n1. quite; entirely; completely..."
          },
          {
            "id": 1430,
            "createdAt": "2021-05-15T22:45:52.000+00:00",
            "parentId": 1411,
            "title": "どうぞ",
            "notePicture": "",
            "head": false,
            "shortDescription": "1. please; kindly; I beg of you​See also 何卒\r\nどう..."
          },
          {
            "id": 1432,
            "createdAt": "2021-05-15T22:50:00.000+00:00",
            "parentId": 1411,
            "title": "何卒",
            "notePicture": "",
            "head": false,
            "shortDescription": "/なにとぞ/\r\n\r\nAdverb\r\n1. please; kindly; I beg of y..."
          },
          {
            "id": 1441,
            "createdAt": "2021-05-15T23:50:50.000+00:00",
            "parentId": 1411,
            "title": "恰も / あたかも/ 宛も",
            "notePicture": "",
            "head": false,
            "shortDescription": "恰似;犹如;宛如;正好;正是\n[ 恰も;宛も ]\n(1)その日はあたかも春のような陽気だった。..."
          },
          {
            "id": 1473,
            "createdAt": "2021-05-18T23:08:00.000+00:00",
            "parentId": 1411,
            "title": "然も / さも",
            "notePicture": "",
            "head": false,
            "shortDescription": "1. really (seem, appear, etc.); truly; evidentl..."
          },
          {
            "id": 1478,
            "createdAt": "2021-05-20T12:10:26.000+00:00",
            "parentId": 1411,
            "title": "どうやら",
            "notePicture": "",
            "head": false,
            "shortDescription": "Adverb\r\n1. possibly; apparently; (seem) likely;..."
          },
          {
            "id": 1479,
            "createdAt": "2021-05-20T12:13:21.000+00:00",
            "parentId": 1411,
            "title": "どうも",
            "notePicture": "",
            "head": false,
            "shortDescription": "thank you; thanks​Abbreviation, See also どうも有難う..."
          },
          {
            "id": 3169,
            "createdAt": "2021-08-07T22:23:18.000+00:00",
            "parentId": 1411,
            "title": "ずっと",
            "notePicture": null,
            "head": false,
            "shortDescription": "（1）（比……）……得多de，……得很，还要……。（数量、程度にはなはだしい開きのあるさま。は..."
          },
          {
            "id": 3170,
            "createdAt": "2021-08-07T22:24:14.000+00:00",
            "parentId": 1411,
            "title": "やっと",
            "notePicture": null,
            "head": false,
            "shortDescription": "（1）好不容易，终于，才。（長い時間を要したが、ようやく。）\r\n　 やっと彼女をくどいた／好不..."
          },
          {
            "id": 3171,
            "createdAt": "2021-08-07T22:27:13.000+00:00",
            "parentId": 1411,
            "title": "屹度 / 急度 / きっと",
            "notePicture": null,
            "head": false,
            "shortDescription": "Adverb (fukushi)\r\n1. surely; undoubtedly; almos..."
          },
          {
            "id": 3172,
            "createdAt": "2021-08-07T22:30:35.000+00:00",
            "parentId": 1411,
            "title": "どっと",
            "notePicture": null,
            "head": false,
            "shortDescription": "（1）许多人一起发出声音状。（大勢の人の歓声・笑い声などが聞こえるさま。）\r\n　 皆がどっと笑..."
          },
          {
            "id": 3173,
            "createdAt": "2021-08-07T22:32:25.000+00:00",
            "parentId": 1411,
            "title": "もっと",
            "notePicture": null,
            "head": false,
            "shortDescription": "（1）更,更加。（さらに。）\r\n　 もっと右へ寄ってください。／请再靠右边一些。\r\n　 もっと..."
          }
        ],
        "owns": true
      },
      "readonly": false
    },
    "reviewSetting": null,
    "remainingInitialReviewCountForToday": null
  },
  "quizQuestion": {
    "questionType": "DESCRIPTION_LINK_TARGET",
    "options": [
      {
        "note": {
          "id": 2193,
          "noteContent": {
            "id": 2193,
            "title": "名詞",
            "description": null,
            "url": null,
            "urlIsVideo": false,
            "pictureUrl": null,
            "pictureMask": null,
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-06-26T23:08:19.000+00:00"
          },
          "createdAt": "2021-06-26T23:08:19.000+00:00",
          "parentId": 1594,
          "title": "名詞",
          "notePicture": null,
          "head": false,
          "shortDescription": null
        },
        "picture": false,
        "display": "名詞"
      },
      {
        "note": {
          "id": 1733,
          "noteContent": {
            "id": 1733,
            "title": "形容動詞",
            "description": "形容動詞は、平安時代に形容詞が不足したとき、形容詞で表現できない意味を持つ名詞を語幹として「なり（←助詞「に」+動詞「あり」）」または「たり（←助詞「と」+動詞「あり」）」をつけることによって成立した[1]。（ナリ活用とタリ活用。前者は現在のダ型活用、後者はタルト型活用[注 1]）。\r\n\r\n独立した品詞としてこれを立てることに否定も多く、それぞれ別に節を立てて説明するが、形容詞とする立場、名詞とする立場がある。「形容動詞」という名称にも異論がある。まず、独立した品詞とする立場から説明し、その後に異論を示す。",
            "url": "https://ja.m.wikipedia.org/wiki/%E5%BD%A2%E5%AE%B9%E5%8B%95%E8%A9%9E",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-06-03T23:31:27.000+00:00"
          },
          "createdAt": "2021-06-03T23:31:27.000+00:00",
          "parentId": 1594,
          "title": "形容動詞",
          "notePicture": "",
          "head": false,
          "shortDescription": "形容動詞は、平安時代に形容詞が不足したとき、形容詞で表現できない意味を持つ名詞を語幹として「な..."
        },
        "picture": false,
        "display": "形容動詞"
      },
      {
        "note": {
          "id": 2018,
          "noteContent": {
            "id": 2018,
            "title": "動詞",
            "description": "",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-06-19T10:32:31.000+00:00"
          },
          "createdAt": "2021-06-19T10:32:31.000+00:00",
          "parentId": 1594,
          "title": "動詞",
          "notePicture": "",
          "head": false,
          "shortDescription": ""
        },
        "picture": false,
        "display": "動詞"
      },
      {
        "note": {
          "id": 1412,
          "noteContent": {
            "id": 1412,
            "title": "接続詞",
            "description": "/せつぞくし/\r\n\r\n品詞の一。自立語で活用がなく、先行する語や文節・文を受けて後続する語や文節・文に言いつづけ、それらのものの関係を示すはたらきをもつ語。順接（だから、したがって）・逆接（しかし、けれども）・累加（また、および）・選択（あるいは、もしくは）などの種類がある",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-07-15T23:33:46.000+00:00"
          },
          "createdAt": "2021-05-13T00:02:09.000+00:00",
          "parentId": 1594,
          "title": "接続詞",
          "notePicture": "",
          "head": false,
          "shortDescription": "/せつぞくし/\r\n\r\n品詞の一。自立語で活用がなく、先行する語や文節・文を受けて後続する語や文..."
        },
        "picture": false,
        "display": "接続詞"
      },
      {
        "note": {
          "id": 1411,
          "noteContent": {
            "id": 1411,
            "title": "副詞",
            "description": "Adverb　/ふくし/",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-05-12T23:58:50.000+00:00"
          },
          "createdAt": "2021-05-12T23:58:50.000+00:00",
          "parentId": 1594,
          "title": "副詞",
          "notePicture": "",
          "head": false,
          "shortDescription": "Adverb　/ふくし/"
        },
        "picture": false,
        "display": "副詞"
      },
      {
        "note": {
          "id": 2005,
          "noteContent": {
            "id": 2005,
            "title": "自立語",
            "description": "/じりつご/\r\n自身可做文节（具有语法功能的最小单位）的词语",
            "url": "",
            "urlIsVideo": false,
            "pictureUrl": "",
            "pictureMask": "",
            "useParentPicture": false,
            "skipReview": false,
            "hideTitleInArticle": false,
            "showAsBulletInArticle": false,
            "updatedAt": "2021-07-15T23:19:42.000+00:00"
          },
          "createdAt": "2021-06-17T23:56:04.000+00:00",
          "parentId": 1594,
          "title": "自立語",
          "notePicture": "",
          "head": false,
          "shortDescription": "/じりつご/\r\n自身可做文节（具有语法功能的最小单位）的词语"
        },
        "picture": false,
        "display": "自立語"
      }
    ],
    "description": "<p>The following descriptions is an instance of:</p><pre style='white-space: pre-wrap;'>1. really (seem, appear, etc.); truly; evidently​Usually written using kana alone\r\n笑いで誤魔化すと、亜美さんは<mark title='Hidden text that is matching the answer'>[...]</mark>不機嫌そうに眉を寄せた。Ami frowned in a very un-amused way as I brushed her off with a laugh.\r\n\r\n2. in that way​Usually written using kana alone, See also <mark title='Hidden text that is matching the answer'>[...]</mark>ありなん\r\n\r\n副】\r\n（1）非常，很，实在，真。（本当にそれらしいさま。）\r\n　 <mark title='Hidden text that is matching the answer'>[...]</mark>残念そうな顔／仿佛非常遗憾的表情。\r\n　 <mark title='Hidden text that is matching the answer'>[...]</mark>うれしそうにみえる／显得很高兴的样子。\r\n　 <mark title='Hidden text that is matching the answer'>[...]</mark>熱心なふうをよそおう／装得很热心。\r\n（2）那样，好象，仿佛。（そのように。そのとおり。）\r\n　 <mark title='Hidden text that is matching the answer'>[...]</mark>ありそうなことだ／好象是会有的事情；很可能有的事情。\r\n　 <mark title='Hidden text that is matching the answer'>[...]</mark>いいことづくめのように言う／说得天花乱坠。</pre> ",
    "mainTopic": "",
    "hintLinks": null,
    "viceReviewPointIds": [
      1948
    ],
    "scope": [
      {
        "id": 392,
        "noteContent": {
          "id": 392,
          "title": "日本語",
          "description": "",
          "url": "",
          "urlIsVideo": false,
          "pictureUrl": "",
          "pictureMask": "",
          "useParentPicture": false,
          "skipReview": true,
          "hideTitleInArticle": false,
          "showAsBulletInArticle": false,
          "updatedAt": "2021-04-03T00:47:18.000+00:00"
        },
        "createdAt": "2021-03-26T23:29:10.000+00:00",
        "parentId": null,
        "title": "日本語",
        "notePicture": "",
        "head": true,
        "shortDescription": ""
      }
    ]
  },
  "emptyAnswer": {
    "answer": null,
    "answerNoteId": null,
    "questionType": "DESCRIPTION_LINK_TARGET",
    "viceReviewPointIds": [
      1948
    ]
  },
  "toRepeatCount": 52
}

export const QuizStory = args => ({
  components: { Quiz },
  data() {
    return {noteData: repetition, colors, linkTypeOptions};
  },
  setup() {
    return { args, ...actionsData };
  },
  template: `
  <Quiz v-bind="noteData" :staticInfo="{linkTypeOptions, colors}"/>
  `,
});