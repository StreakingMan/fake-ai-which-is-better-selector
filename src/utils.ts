import SparkMD5 from 'spark-md5';
export const calcFileMD5: (file: File) => Promise<string> = async (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);
        fileReader.onload = (ev) => {
            if (!ev.target?.result) return reject('no result');
            const md5 = SparkMD5.hashBinary(ev.target.result as string);
            resolve(md5);
        };
        fileReader.onerror = () => {
            reject('something error');
        };
    });
};

export const getFileLocalUrl: (file: File) => Promise<string> = async (
    file
) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (ev) => {
            if (!ev.target?.result) return reject('no result');
            resolve(ev.target.result as string);
        };
        fileReader.onerror = () => {
            reject('something error');
        };
    });
};
