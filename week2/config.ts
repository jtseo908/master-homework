// 현재 환경변수 분리 및 관리가 완전 엉망으로 되어 있는데, 일단 아래부터 작업하여 조금씩 바꿔나간다.
// NEXT_PUBLIC_이 prefix로 있는 것 부터 옮긴다.

const CLIENT_ENVS: { [key: string]: string | undefined } = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

const getEnvironmentVariable = (environmentVariable: string): string => {
  const unValidatedEnvironmentVariable =
    process.env[environmentVariable] || CLIENT_ENVS[environmentVariable];

  if (!unValidatedEnvironmentVariable) {
    alert(`Couldn't find environment variable: ${environmentVariable}`);
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  } else {
    return unValidatedEnvironmentVariable;
  }
};

const config = {
  baseUrl: getEnvironmentVariable("NEXT_PUBLIC_BASE_URL"),
  apiUrl: getEnvironmentVariable("NEXT_PUBLIC_API_URL"),
};

export default config;
