import * as React from "react";
import {observer} from 'mobx-react';
import {IProxy} from '../../Store';
import Link from '../Link';
import NavExpansionPanel from '../NavExpansionPanel';
import "./index.css";

export interface IProps {
  proxies: Map<string, IProxy>;
  idPrefix?: string;
}

function ProxyList({ proxies, idPrefix: idPrefixProp }: IProps) {
  const idPrefix = idPrefixProp ?? '';
  const groups = Array.from(proxies)
    .filter(([id]) => id.includes('/'))
    .reduce((prev, [id, proxy]) => {
      const segments = id.split('/')
      const firstSegment = segments.shift()!

      if (!(firstSegment in prev)) {
        prev[firstSegment] = new Map<string, IProxy>()
      }

      prev[firstSegment].set(segments.join('/'), proxy)

      return prev
    }, {} as Record<string, Map<string, IProxy>>)

  return (
    <ul>
      {Array.from(proxies)
        .filter(([id]) => !id.includes('/'))
        .map(([id, proxy]) => {
          return (
            <li key={idPrefix + id} className={'proxy'}>
              <span>
                <Link id={encodeURIComponent(idPrefix + id)}>{id}</Link>
              </span>
            </li>
          )
        })}
      {Object.entries(groups).map(([key, group]) => {
        return (
          <li key={key}>
            <NavExpansionPanel title={key}>
              <div className={'proxy-group'}>
                <ProxyList proxies={group} idPrefix={`${idPrefix}${key}/`} />
              </div>
            </NavExpansionPanel>
          </li>
        )
      })}
    </ul>
  )
}

export default observer(ProxyList);