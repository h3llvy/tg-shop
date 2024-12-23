import { useClientOnce } from "@/hooks/useClientOnce";
import {
  isTMA,
  type LaunchParams,
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
  useClientOnce(() => {
    if (!sessionStorage.getItem("env-mocked") && isTMA("simple")) {
      return;
    }

    // Determine which launch params should be applied. We could already
    // apply them previously, or they may be specified on purpose using the
    // default launch parameters transmission method.
    let lp: LaunchParams | undefined;
    try {
      lp = retrieveLaunchParams();
    } catch (e) {
      const initDataRaw = 'user=%7B%22id%22%3A884422795%2C%22first_name%22%3A%22Maxim%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22evsvmx%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FyffrK5uN1Fq2dm5iapbiiINyDhOMHovTZh0dQoChlmM.svg%22%7D&chat_instance=-3981941625798723228&chat_type=sender&auth_date=1734873315&signature=yvAotvR5_52AKAn8_HPGgWYob6ip14en3dVooG6APbY-jkuOupIW6K1W83v_X2OU0z4yPVA_6nkU8Si1nMPzAQ&hash=4f6ba3e8e4527241614992f4ffb994c132e25615bec73fbcd7c132f523be4253';

      lp = {
        themeParams: {
          accentTextColor: "#6ab2f2",
          bgColor: "#17212b",
          buttonColor: "#5288c1",
          buttonTextColor: "#ffffff",
          destructiveTextColor: "#ec3942",
          headerBgColor: "#17212b",
          hintColor: "#708499",
          linkColor: "#6ab3f3",
          secondaryBgColor: "#232e3c",
          sectionBgColor: "#17212b",
          sectionHeaderTextColor: "#6ab3f3",
          subtitleTextColor: "#708499",
          textColor: "#f5f5f5",
        },
        initData: parseInitData(initDataRaw),
        initDataRaw,
        version: "8",
        platform: "tdesktop",
      };
    }

    sessionStorage.setItem("env-mocked", "1");
    mockTelegramEnv(lp);
    console.warn(
      "⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.",
    );
  });
}

