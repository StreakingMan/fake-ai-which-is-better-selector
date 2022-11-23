import React, {
    ChangeEventHandler,
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import './App.scss';
import { calcFileMD5, getFileLocalUrl } from './utils';

const GithubIcon: FC = () => {
    return (
        <a
            href="https://github.com/StreakingMan/fake-ai-which-is-better-selector"
            target="_blank"
            rel="noreferrer"
            className="github-icon__wrapper"
        >
            <svg
                width="24"
                height="24"
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={'github-icon'}
            >
                <path
                    fillRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
            </svg>
        </a>
    );
};

interface Image {
    md5: string;
    url: string;
}

function App() {
    // 训练数量，更新时间
    const [trainedNum, setTrainedNum] = useState<number>(
        Number(localStorage.getItem('trainedNum') || '1450')
    );
    const [updateTime, setUpdateTime] = useState<number>(
        Number(localStorage.getItem('updateTime') || new Date().getTime())
    );
    useEffect(() => {
        const lastTimeString = localStorage.getItem('updateTime');
        if (!lastTimeString) {
            localStorage.setItem('updateTime', updateTime.toString());
            localStorage.setItem('trainedNum', trainedNum.toString());
            return;
        }
        const lastTime = Number(lastTimeString);
        if (isNaN(lastTime)) return;
        // 假数据超过12小时更新一次
        const currentTime = new Date().getTime();
        if (currentTime - lastTime > 12 * 60 * 60 * 1000) {
            // 将更新时间设置到过去6小时的某个时间点
            const newFakeUpdateTime =
                currentTime - Math.round(Math.random() * 6 * 60 * 60 * 1000);
            localStorage.setItem('updateTime', newFakeUpdateTime.toString());
            setUpdateTime(newFakeUpdateTime);
            // 训练样本数随机增加
            const newFakeTrainedNum =
                trainedNum + Math.round(Math.random() * 500);
            localStorage.setItem('trainedNum', newFakeTrainedNum.toString());
            setTrainedNum(newFakeTrainedNum);
        }
    });

    // 昵称
    const [nickname, setNickname] = useState<string>('@streakingman');
    useEffect(() => {
        const urlObj = new URL(location.href);
        const searchParams = urlObj.searchParams;
        const nickname = searchParams.get('nickname');
        if (nickname) setNickname(nickname);
    }, []);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imageList, setImageList] = useState<Image[]>([]);

    const onChange: ChangeEventHandler<HTMLInputElement> = async (ev) => {
        const files = ev.target.files;
        if (!files?.length) return;
        if (files.length < 2) return;
        setFakeBest('');
        setTalk(sweetTalk[0]);
        const list: Image[] = [];
        for (const file of files) {
            list.push({
                md5: await calcFileMD5(file),
                url: await getFileLocalUrl(file),
            });
        }
        setImageList(list);
        fakeSort(list);
        console.log(list);
    };

    const onSelect = () => {
        if (sorting) return;
        if (talk === sweetTalk[sweetTalk.length - 1]) return;
        imageInputRef.current?.click();
    };

    // 骚话
    const sweetTalk = [
        '选择图片',
        '正在上传到云端...',
        '图像识别中...',
        '特征分析中...',
        'AI打分中...',
        '喜好度排序中...',
        '马上好了，等一等...',
        '就是这个！',
    ];
    const [sorting, setSorting] = useState<boolean>(false);
    const [talk, setTalk] = useState<string>(sweetTalk[0]);
    const [fakeBest, setFakeBest] = useState<string>('');

    const fakeSort = (_imageList: Image[]) => {
        setSorting(true);
        setTalk(sweetTalk[1]);
        let index = 1;
        const timer = () => {
            setTimeout(() => {
                index++;
                setTalk(sweetTalk[index]);
                if (index === sweetTalk.length - 1) {
                    const _fakeBest = _imageList
                        .slice()
                        .sort((a, b) => (a.md5 > b.md5 ? -1 : 1))[0].md5;
                    setFakeBest(_fakeBest);
                    document.getElementById(_fakeBest)?.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                    });
                    setSorting(false);
                    setTimeout(() => {
                        setTalk(sweetTalk[0]);
                    }, 2000);
                    return;
                } else {
                    timer();
                }
            }, Math.round(1000 + 2000 * Math.random()));
        };
        timer();
    };

    return (
        <>
            <GithubIcon />
            <h1>AI 喜好选择器</h1>
            <h2>
                基于
                <a
                    href="https://www.tensorflow.org/?hl=zh-cn"
                    target="_blank"
                    rel="noreferrer"
                >
                    TensorFlow
                </a>
                深度学习框架，由 【{nickname}】 进行训练
            </h2>
            <h2>
                当前训练样本数高达 【{trainedNum}】 （更新时间{' '}
                {new Date(updateTime).toLocaleString()}）
            </h2>
            <h2>AI 做出的选择能很大程度上代表 【{nickname}】的喜好</h2>
            <div className="button" onClick={onSelect}>
                {talk}
                <input
                    ref={imageInputRef}
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                />
            </div>
            <div className="image__scroll-container">
                {imageList.map((img) => (
                    <img
                        id={img.md5}
                        className={`image ${
                            img.md5 === fakeBest ? 'active' : ''
                        }`}
                        alt=""
                        key={img.md5}
                        src={img.url}
                    />
                ))}
            </div>
        </>
    );
}

export default App;
