import { uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { FirebaseConfig } from "./config";

export enum StorageType {
  logo = 'logo',
  profile = 'profile',
  task = 'task',
}

export class Storage {
  async upload({ base64, name, type }: {
    base64: string,
    name: string,
    type: StorageType,
  }): Promise<string> {
    const storageRef = ref(FirebaseConfig.storage, `${type}/${name}`);
    const uploadTask = await uploadString(storageRef, base64, 'base64');
    const url = await getDownloadURL(uploadTask.ref);
    console.log(`File uploaded successfully. ${url}`);
    return url;
  }

  async delete(url: string) {
    const storageRef = ref(FirebaseConfig.storage, url);
    deleteObject(storageRef).then(() => {
      console.log(`File deleted successfully`);
    });
  }
}

/*
image/jpeg
image/png
application/pdf
application/zip
.doc	Microsoft Word	application/msword
.docx	Microsoft Word (OpenXML)	application/vnd.openxmlformats-officedocument.wordprocessingml.document

.xls	Microsoft Excel	application/vnd.ms-excel
.xlsx	Microsoft Excel (OpenXML)	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

.ppt	Microsoft PowerPoint	application/vnd.ms-powerpoint
.pptx	Microsoft PowerPoint (OpenXML)	application/vnd.openxmlformats-officedocument.presentationml.presentation
*/