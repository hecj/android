using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace demo
{
    public partial class MainPage : UserControl
    {

        Person p = new Person() { Name="张三",Age=18,Sex=true};

        public MainPage()
        {
            InitializeComponent();
        }



        private void Button_Click(object sender, RoutedEventArgs e)
        {
           // RadAlert radAlert = new Telerik.Windows.Controls.RadAlert();
           // MessageBox.Show("哈哈");
            p.Name = "李四";

        }

        private void Button_Click2(object sender, DragEventArgs e)
        {

        }

        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            this.text1.DataContext = p;
        }
    }
}
