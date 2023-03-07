import Head from "next/head";
import Image from "next/image";
import { GithubService } from "@/services/GithubServices";
import { useEffect, useMemo, useState } from "react";
import TopHeader from "@/components/Navbar/TopHeader";
import GithubIcon from "../../public/icons/github.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Pagination, Button } from "antd";
import List from "@/components/List/List";

export default function Home() {
  const githubService = new GithubService();
  const [user, setUser] = useState<any>();
  const [repoData, setRepoData] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [current, setCurrent] = useState(1);
  const searchUser = useSelector(
    (state: RootState) => state.searchUser.searchUserData
  );

  useEffect(() => {
    async function fetchUserData() {
      const data = (await githubService.getUserData(searchUser)).data;
      const repo = (await githubService.getRepo(searchUser)).data;
      setUser(data);
      setRepoData(repo);
      setMaxIndex(4);
    }

    fetchUserData();
  }, [searchUser]);

  const handleChangePage = (page: any) => {
    setCurrent(page);
    setMinIndex((page - 1) * 4);
    setMaxIndex(page * 4);
  };
  if (!user || !repoData) return <p>Loading</p>;
  return (
    <>
      <Head>
        <title>Git Viewer | Ananda Zukhruf</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TopHeader
          content={
            <>
              <Image src={GithubIcon.src} alt="icon" width={42} height={42} />
              <h1>Github Viewer</h1>
            </>
          }
        />
        <div className="content">
          <div className="profile-container">
            <div className="image-container">
              <img src={user.avatar_url} />
            </div>
            <div className="text-container">
              <h1>{user.name}</h1>
              <h3>{user.login}</h3>
              <p>{user.bio}</p>
              <Button href={user.html_url} className="mt-4 max-w-4xl">
                See Profile on Github
              </Button>
            </div>
          </div>

          <div className="repo-container">
            {repoData &&
              repoData.map(
                (r: any, i: any) =>
                  i >= minIndex &&
                  i <= maxIndex && (
                    <a href={r.html_url}>
                      <List key={i}>
                        <h1>{r.name}</h1>
                        <p className="lang">{r.language}</p>
                        <p>{r.description}</p>
                      </List>
                    </a>
                  )
              )}
            {repoData && repoData.length > 0 && (
              <Pagination
                pageSize={4}
                current={current}
                total={repoData.length}
                onChange={(page) => handleChangePage(page)}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
