import "react";

// mdui Web Components 使用原生 class 属性而非 className
type MduiBase = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  class?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "mdui-layout": MduiBase;
      "mdui-layout-main": MduiBase;
      "mdui-navigation-drawer": MduiBase & { open?: boolean; contained?: boolean };
      "mdui-top-app-bar": MduiBase;
      "mdui-top-app-bar-title": MduiBase;
      "mdui-list": MduiBase;
      "mdui-list-item": MduiBase & {
        active?: boolean;
        icon?: string;
        headline?: string;
        description?: string;
      };
      "mdui-button": MduiBase & {
        variant?: string;
        loading?: boolean;
        disabled?: boolean;
        "full-width"?: boolean;
      };
      "mdui-button-icon": MduiBase & { icon?: string };
      "mdui-icon": MduiBase & { name?: string };
      "mdui-card": MduiBase & { variant?: string };
      "mdui-linear-progress": MduiBase;
      "mdui-circular-progress": MduiBase;
      "mdui-divider": MduiBase;
      "mdui-dialog": MduiBase & { open?: boolean; headline?: string };
    }
  }
}
