---
title: ABC462G
date: 2026-06-16 12:17:36
author: Hanbingqigu
categories:
  - 题解
---

你这 ABC 出 NTT 题它合法吗？由于这道题被迫去学了 FFT 和 NTT。

## Description

给定长度为 $N \le 2 \times 10^5$ 的序列 $A,B (A_i,B_i \le N)$，求将 $A$ 随机重排后满足对于任意的 $i$ 使得 $A_i \ne B_i$ 的概率。数字相同但位置不同的数是可区分的，也就是说总方案数为 $N!$。

## Solution

可以用一种崭新的方式来看待这个问题。

考虑将 $A$ 重排的本质是找到一个**排列** $P$，将 $A_i$ 放到 $A_{P_i}$ 的位置，这样问题就变为了满足要求的排列数量，也就是满足 $A_{P_i} \ne B_i$。对于这样类似错排的排列计数问题，可以放到网格图上来理解。具体的，绘制一个 $N \times N$ 的网格图，将里面恰好 $N$ 个点涂黑，满足每一行和每一列恰好有一个黑格（如下图）。不难发现一个排列唯一对应了这样一个网格图，假如一个黑格的坐标是 $(x,y)$，那么 $P_x =  y$。下图表示排列 $[4,1,3,2]$。

![](https://cdn.luogu.com.cn/upload/image_hosting/rub5saeu.png)

限制 $A_{P_i} = B_i$ 的本质是什么？显然，$A,B$ 的初始顺序不会影响答案，因此我们可以向将 $A,B$ 排序。考虑 $A=[1,1,2,4], B=[1,2,4,4]$。$A_1,A_2$ 的两个 $1$ 不能放在位置 $1$，即 $P_1,P_2 \ne 1$。$A_3$ 的 $2$ 不能放在位置 $2$，即 $P_3 \ne 2$。$A_4$ 的 $4$ 不能放在位置 $3,4$，即 $P_4 \notin \set{3,4}$。不难发现，限制的本质是若干形如 $P_x \ne y$ 的条件，也就是在网格图上某些格子**不能被涂黑**，如下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/ip7rfv5x.png)

这些限制有如下性质：

性质 1：每个值 $v$ 对应一个矩形，高度 $h_i$ 为 $A$ 中 $v$ 的出现次数，宽度 $w_i$ 为 $B$ 中 $v$ 出现的次数。

性质 2：每个矩形的的长和宽分别占据一段连续的区间，这些区间并起来为 $[1,n]$

+ 排序后，设 $v$ 在 $A$ 中出现区间为 $[a,b]$，在 $B$ 中出现区间为 $[c,d]$，那么这意味着 $P_{a \dots b} \notin [c,d]$，这在网格图中表现为一个矩形，高度为 $b - a + 1$，宽度为 $d - c + 1$，覆盖了 $[a,b]$ 行和 $[c,d]$ 列。

现在问题变为这些矩形不能涂黑的前提下有多少种合法的方案。

考虑按照行进行容斥，设 $A_i$ 表示要求第 $i$ 行的黑点**恰好落在不允许的位置**的方案集合，由于每一行只会有一个矩形占据，也就是说，第 $i$ 行要落在这个矩形的这一行中。设 $A_S$ 表示对于 $i \in S$ 都要求第 $i$ 行的黑点恰好落在不允许的位置的方案集合，也就是 $\bigcap_{i \in S} A_i$，那么：
$$
ans = \sum_{S \subseteq [1,N] \cap \Z} (-1)^{|S|} \big|A_S \big|
$$
现在来计算 $\big|A_S \big|$。枚举每一个值 $v$ 所对应矩形，设这个矩形中带有限制的行集合是 $T_v$，那么第 $1$ 行有 $w_v$ 种，第 $2$ 行有 $w_v - 1$ 种，以此类推，答案为：
$$
A_{w_v}^{\big|T_v \big|} = \binom {w_v} {\big|T_v \big|} \big|T_v \big|!
$$
由于在行上所有矩形是不交的，因此矩形间没有影响，直接乘起来，这一部分是：
$$
\prod_{v=1}^N \binom {w_v} {\big|T_v \big|} \big|T_v \big|!
$$
选完所有带有限制的行，对于剩下没有限制的行直接做全排列即可，这一部分是 $(N -\big|S \big|)!$，因此：
$$
\big|A_S \big| = (N-\big|S \big|)! \prod_{v=1}^N \binom {w_v} {\big|T_v \big|} \big|T_v \big|!
$$
代回原式：
$$
ans = \sum_{S \subseteq [1,N] \cap \Z} (-1)^{|S|} (N-\big|S \big|)! \prod_{v=1}^N \binom {w_v} {\big|T_v \big|} \big|T_v \big|!
$$
这一步较为难想，我们需要枚举 $|S| = k$，考虑 $\prod_{v=1}^N \binom {w_v} {\big|T_v \big|} \big|T_v \big|!$ 这一项的贡献。当 $|S| = k$ 固定时，$\sum_v \big|T_v \big| = k$（因为每个矩形带有限制的行数加起来就是所有带有限制的行数），直接考虑暴力枚举每个 $v$ 对应的 $\big|T_v \big|$ 为 $c_v$，需要先在这个矩形的 $h_v$ 行中选出 $c_v$ 带有限制的行，因此带有一个 $\binom {h_v} {c_v}$ 的系数。总贡献为：
$$
f(k) = \sum_{\sum_v{c_v}=k} \prod_{v=1}^N \binom {h_v} {c_v} \binom {w_v} {c_v} c_v!
$$
则答案为：
$$
ans = \sum_{k=0} ^N (-1)^k (N - k)! f(k)
$$
需要求出 $k=0,1,\dots,n$ 时所有 $f(k)$ 的值。

这个问题可以用背包 dp 求解，复杂度为 $O(N^2)$，无法通过，因此需要用多项式乘法优化。

构造生成函数：
$$
F_v(x) = \sum_{n=0}^\infty \binom {h_v} {n} \binom {w_v} {n} n! x^n
$$
所有 $F_v(x)$ 的乘积 $F(x) = \prod_v F_v(x)$ 的 $x^k$ 项系数 $[x^k]F(x)$ 即为 $f(k)$ 的值。

由于当 $n > \min(h_v,w_v)$ 时 $\binom {h_v} {n} \binom {w_v} {n}=0$，因此 $F_v(x)$ 最高次数仅为 $\min(h_v,w_v)$。又有 $\sum_v h_v = \sum_v w_v = N$，因此所有 $F_v(x)$ 的次数和为 $O(N)$。使用 NTT 每次合并两个次数最低的函数，可以在总共 $O(N\log^2N)$ 复杂度内解决此问题。

> 为什么是 $O(N \log^2 N)$？考虑将合并过程抽象为一棵二叉树，每一个非叶子节点代表将左子树和右子树代表的集合合并后的结果。对于一将棵合并树，其代价为每个叶子的权值（也就是这个多项式的次数）乘上这个叶子的深度（即合并次数）。 $F_1 \sim F_N$ 直接按照线段树的方式合并，不足 $2$ 的整次幂的补 $0$。这颗合并树的深度为 $\log N$，所有叶子权值之和为 $O(N)$，代价为 $O(N \log N)$，另外 NTT 合并有额外 $\log N$ 系数，因此这棵合并树的复杂度为 $O(N \log^2 N)$。也就是说直接这样合并就可以通过。对于我们的策略，这本质上实在构建一棵[哈夫曼树](https://oi-wiki.org/ds/huffman-tree/)（每次合并两个权值最小的）。参考 oiwiki 上的证明，哈夫曼树是所有合并树中代价最小的，因此一定不劣于线段树合并策略，则说明我们的策略复杂度为 $O(N\log^2N)$。

至此，我们以 $O(N \log^2 N)$ 复杂度解决了此问题。

核心代码：

```cpp
#define int long long
// fac[x] = x!
// inv[x] = (x!)^(MOD - 2)

// 用一个小根堆记录所有多项式
using Elem = pair<size_t, vector<int>>;
priority_queue<Elem, vector<Elem>, greater<Elem>> heap;
for (int i = 1; i <= n; i++) {
    // 构造第 i 个生成函数 F(x)
    vector<int> F;
    for (int k = 0; k <= min(h[i], w[i]); k++) {
        F.push_back(C(h[i], k) * C(w[i], k) % MOD * fac[k] % MOD);
    }
    heap.emplace(F.size(), F);
}

while (heap.size() > 1u) {
    vector<int> f = heap.top().second;
    heap.pop();
    vector<int> g = heap.top().second;
    heap.pop();
    // 重载 vector 为多项式乘法运算
    // NTT 模板这里不再展示
    vector<int> h = f * g;
    heap.emplace(h.size(), h);
}
vector<int> F = heap.top().second;

int ans = 0;
F.resize(n + 1);
for (int s = 0; s <= n; s++) {
    int coef = (s & 1) ? MOD - 1 : 1;
    ans = (ans + coef * fac[n - s] % MOD * F[s] % MOD) % MOD;
}
cout << ans * inv[n] % MOD << '\n';
```

