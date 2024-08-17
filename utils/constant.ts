import { randomUUID } from "crypto";
import shortid from "shortid";

export const websitePath = "http://localhost:23333/static/website/";

export const imagePath = "http://localhost:23333/images/";

export type typeCompony = {
  id?: string;
  name: string;
  tel?: string;
  net?: string;
  tags: string[];
  images: string[];
  logo?: string;
  profile?: string;
  videos?: string[];
};

export const createDefCompany = (map?: typeCompony): typeCompony => {
  return {
    id: "1",
    name: "1",
    tel: "2",
    net: "3",
    tags: [],
    images: [],
    videos: [],
    logo: "",
    profile: "5",
    ...map,
  };
};

export const companyMap = {
  id: {
    chKey: "id",
    type: "string",
    processData: (data: typeCompony) => {
      return data.id;
    },
  },
  name: {
    chKey: "名称",
    type: "string",
    processData: (data: typeCompony) => {
      return data.name;
    },
  },
  tel: {
    chKey: "电话",
    type: "string",
    processData: (data: typeCompony) => {
      return data.tel;
    },
  },
  net: {
    chKey: "网络",
    type: "string",
    processData: (data: typeCompony) => {
      return data.net;
    },
  },
  tags: {
    chKey: "标签",
    type: "tags",
    processData: (data: typeCompony) => {
      return data.tags;
    },
  },
  logo: {
    chKey: "logo",
    type: "images",
    processData: (data: typeCompony) => {
      return [
        data.logo ? getCompanyAssetsPath(data.name, data.logo) : undefined,
      ];
    },
  },
  images: {
    chKey: "图片",
    type: "images",
    processData: (data: typeCompony) => {
      console.log("Log-- ", data, "data");
      return data.images?.map((i) => getCompanyAssetsPath(data.name, i));
    },
  },
  videos: {
    chKey: "视频",
    processData: (data: typeCompony) => {
      return data.videos?.map((i) => getCompanyAssetsPath(data.name, i));
    },
    type: "videos",
  },
  profile: {
    chKey: "资料",
    type: "textarea",
    processData: (data: typeCompony) => {
      return data.profile;
    },
  },
};
export const companyMapStrKeys = ["name", "tel", "net", "profile"];
export const companyKeyEsToch = (key: string): string => {
  return companyMap[key]?.chKey || key;
};

export const backPath = "http://localhost:23335/";

export const peopleAssetsPath = backPath + "/company/";

export const defCompany: typeCompony = createDefCompany();

export const getCompanyAssetsPath = (name: string, p: string) => {
  return peopleAssetsPath + "/" + name + "/" + p;
};

export const imageKey = "image";
export const glbKey = "glb";
export const videoKey = "video";

export const imageFormats = ["png", "heic", "webp", "jpg", "jpeg", "tga"];

export const deviceTypes = ["action2", "pocket3"] as const;
